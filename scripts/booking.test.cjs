const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");

// Transpile the actual TS modules, replacing only external payment/database IO.
function load(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const localRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith(".")) {
      const sharedMock = Object.entries(mocks).find(
        ([key]) =>
          key.startsWith(".") && path.basename(key) === path.basename(name),
      );
      if (sharedMock) return sharedMock[1];
    }
    if (name.startsWith("."))
      return load(
        path.relative(root, path.resolve(path.dirname(filename), name)) + ".ts",
        mocks,
        cache,
      );
    return require(name);
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {
    filename,
  })(localRequire, module, module.exports);
  return module.exports;
}
const catalog = load("data/catalog.ts");
test("all supplied bundle prices, including long-coat cats, remain exact", () => {
  const expected = [[4874,6374,7999],[8999,11999,14999],[13999,18749,23374],[6874,9124,11249],[7499,9874,12124],[6374,7999,8749],[11999,14999,16499],[18749,23374,25749],[9124,11249,12499],[9874,12124,13499],[4874,6374],[8999,11999],[13999,20999],[6874,9124]];
  catalog.SUPER_SAVER_BUNDLES.forEach((b,index)=>{
    (b.petType === 'cat' ? ['short','long'] : ['small','medium','large']).forEach((tier,i)=>{
      const q=catalog.quoteItem({id:'bundle',serviceId:b.id,category:'bundle',petType:b.petType,petSize:b.petType==='cat'?'small':tier,coatType:b.petType==='cat'?tier:b.coatType,nights:1,quantity:1,addons:[]});
      assert.equal(q.total,expected[index][i]);
      assert.equal(q.discount,0);
    });
  });
});
test("breed choices use the supplied grooming tiers and separate boarding weights",()=>{
  const base={id:'breed',serviceId:'furry-fresh',category:'grooming',petType:'dog',petSize:'small',selectionMode:'breed',nights:1,quantity:1,addons:[]};
  assert.equal(catalog.quoteItem({...base,breed:'Labrador'}).total,699);
  assert.equal(catalog.quoteItem({...base,breed:'Beagle',petSize:'large'}).total,499);
  assert.equal(catalog.quoteItem({...base,breed:'Husky'}).total,849);
  assert.equal(catalog.quoteItem({...base,breed:'Labrador',category:'boarding',serviceId:'boarding'}).total,875);
});
test("bundle expiry respects calendar months",()=>{
  const {bundleExpiry}=load('lib/bundle-passes.ts',{'./db':{}});
  assert.equal(bundleExpiry('2027-01-31',1),'2027-02-28');
  assert.equal(bundleExpiry('2026-10-23',16),'2028-02-23');
});
const authMocks = {
  "./db": { query: async () => ({ rows: [] }) },
  "./auth": {
    hashPassword: async () => "hashed-password",
    comparePassword: async () => false,
    signToken: () => "token",
    verifyToken: () => null,
  },
  "./razorpay": {},
};
test("public signup cannot request administrator privileges", async () => {
  let inserted;
  let signed;
  const handlers = load("lib/api-handlers.ts", {
    ...authMocks,
    "./db": {
      query: async (sql, params) => {
        if (sql.includes("INSERT INTO users")) inserted = params;
        return {
          rows: sql.includes("FROM organizations") ? [{ id: "org-1" }] : [],
        };
      },
    },
    "./auth": {
      ...authMocks["./auth"],
      signToken: (payload) => {
        signed = payload;
        return "token";
      },
    },
  });
  const result = await handlers.handleSignup({
    fullName: "Pet Parent",
    phone: "9876543210",
    password: "long-password",
    role: "admin",
  });
  assert.equal(result.status, 201);
  assert.equal(inserted[6], "customer");
  assert.equal(signed.role, "customer");
});
test("signup cannot overwrite an existing customer's password", async () => {
  let writes = 0;
  const handlers = load("lib/api-handlers.ts", {
    ...authMocks,
    "./db": {
      query: async (sql) => {
        if (/UPDATE|INSERT/.test(sql)) writes++;
        return {
          rows: sql.includes("FROM users")
            ? [{ id: "existing", role: "customer", is_phone_verified: true }]
            : [],
        };
      },
    },
  });
  const result = await handlers.handleSignup({
    fullName: "Someone Else",
    phone: "9876543210",
    password: "long-password",
  });
  assert.equal(result.status, 409);
  assert.equal(writes, 0);
});
test("demo admin passwords and unknown-admin shortcuts cannot log in", async () => {
  for (const rows of [
    [],
    [{ id: "admin-1", role: "admin", password_hash: "real-hash" }],
  ]) {
    const handlers = load("lib/api-handlers.ts", {
      ...authMocks,
      "./db": { query: async () => ({ rows }) },
    });
    assert.equal(
      (
        await handlers.handleLogin({
          phone: "9876543210",
          password: "Admin@123",
        })
      ).status,
      401,
    );
  }
});
test("missing JWT secret fails closed instead of using a built-in secret", () => {
  const prior = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    const auth = load("lib/auth.ts");
    assert.throws(
      () => auth.signToken({ userId: "x", role: "admin" }),
      /JWT_SECRET/,
    );
    assert.equal(auth.verifyToken("forged"), null);
  } finally {
    if (prior === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prior;
  }
});
test("public legacy booking endpoint cannot fabricate a paid booking", async () => {
  const route = load("app/api/bookings/route.ts", {
    "@/lib/api-handlers": {},
    "next/server": {
      NextResponse: {
        json: (body, options) => ({ body, status: options.status }),
      },
    },
  });
  assert.equal(
    (
      await route.POST({
        json: async () => ({ paymentStatus: "paid", totalAmount: 1 }),
      })
    ).status,
    410,
  );
});
const item = (overrides = {}) => ({
  id: "pet-1",
  serviceId: overrides.category === "boarding" ? "boarding" : "puppy-kitten-spa",
  category: "grooming",
  petType: "dog",
  petSize: "small",
  nights: 1,
  quantity: 1,
  addons: [],
  petName: "Coco",
  ...overrides,
});
const order = (items = [item()]) => ({
  items,
  customer: {
    name: "Test Pet Parent",
    phone: "9876543210",
    notes: "Gentle dryer, please",
  },
  schedules: Object.fromEntries(
    items.map((i) => [
      i.id,
      { date: catalog.indiaDate(1), slot: catalog.ARRIVAL_WINDOWS[0] },
    ]),
  ),
});

test("every grooming package uses advertised species and size rates", () => {
  for (const service of catalog.GROOMING)
    for (const tier of ["small", "medium", "large", "cat"]) {
      const q = catalog.quoteItem(
        item({
          serviceId: service.id,
          petType: tier === "cat" ? "cat" : "dog",
          petSize: tier === "cat" ? "small" : tier,
        }),
      );
      assert.equal(q.base, service.prices[tier]);
      assert.equal(
        q.total,
        q.base,
      );
    }
  assert.equal(catalog.quoteItem(item()).total, 449);
  assert.equal(
    catalog.quoteItem(item({ serviceId: "medicated-bath" })).total,
    699,
  );
});
test("listed grooming prices are final with no automatic extra discount", () => {
  assert.equal(
    catalog.quoteItem(item({ serviceId: "special-package", petSize: "large" }))
      .discount,
    0,
  );
  assert.equal(
    catalog.quoteItem(item({ serviceId: "medicated-bath", petSize: "large" }))
      .discount,
    0,
  );
});
test("all boarding weight and cat rates, six-night discount, and departure perks", () => {
  for (const [size, rate] of Object.entries({
    small: 625,
    medium: 750,
    large: 875,
  })) {
    assert.equal(
      catalog.quoteItem(
        item({ category: "boarding", petSize: size, nights: 6 }),
      ).total,
      rate * 5,
    );
  }
  assert.equal(
    catalog.quoteItem(
      item({
        category: "boarding",
        petType: "cat",
        catType: "non-neutered",
        nights: 6,
      }),
    ).total,
    3750,
  );
  assert.equal(
    catalog.quoteItem(
      item({
        category: "boarding",
        petType: "cat",
        catType: "neutered",
        nights: 5,
      }),
    ).discount,
    0,
  );
  for (const [nights, perk] of [
    [4, "Furry Fresh"],
    [8, "Special Package"],
    [15, "Full Grooming"],
  ])
    assert.match(
      catalog.quoteItem(item({ category: "boarding", nights })).perk,
      new RegExp(perk),
    );
});
test("cart includes every line, every pet, and selected extras", () => {
  const q = catalog.quoteCart([
    item({ quantity: 2, addons: ["teeth-brushing"] }),
    item({ id: "pet-2", serviceId: "full-grooming" }),
  ]);
  assert.equal(q.total, (449 + 186) * 2 + 2199);
  assert.equal(q.count, 3);
  assert.equal(q.lines.length, 2);
});
test("extras already included in the package cannot be charged again", () => {
  assert.throws(
    () =>
      catalog.quoteItem(
        item({ serviceId: "full-grooming", addons: ["deshedding"] }),
      ),
    /already included/,
  );
  assert.throws(
    () =>
      catalog.quoteItem(
        item({ serviceId: "special-package", addons: ["teeth-brushing"] }),
      ),
    /already included/,
  );
});
test("reject invalid quantities, unknown services, extras, and boarding durations", () => {
  for (const overrides of [
    { quantity: 0 },
    { quantity: 6 },
    { quantity: 1.5 },
    { serviceId: "unknown" },
    { addons: ["unknown"] },
    { addons: ["teeth-brushing", "teeth-brushing"] },
    { category: "boarding", nights: 0 },
    { category: "boarding", nights: 61 },
    { category: "boarding", petType: "cat", catType: "unknown" },
  ])
    assert.throws(() => catalog.quoteItem(item(overrides)));
});
test("IST dates and boarding check-out cross month boundaries correctly", () => {
  assert.match(catalog.indiaDate(), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(catalog.addDays("2026-10-30", 4), "2026-11-03");
});

process.env.RAZORPAY_KEY_SECRET = "booking-tests-only";
process.env.RAZORPAY_KEY_ID = "booking-tests-only";
const signing = load("lib/booking-order.ts");
test("server validates full order and rejects past, malformed and out-of-range dates", () => {
  assert.equal(signing.validateOrder(order()).items.length, 1);
  for (const date of [
    "2020-01-01",
    "2027-02-30",
    "bad",
    catalog.addDays(catalog.indiaDate(), 366),
  ]) {
    const raw = order();
    raw.schedules["pet-1"].date = date;
    assert.throws(() => signing.validateOrder(raw));
  }
  const raw = order();
  raw.items.push(item());
  assert.throws(() => signing.validateOrder(raw));
});
test("signed payment snapshot is bound to its order and cannot be altered", () => {
  const token = signing.signOrder(order(), "order_test");
  assert.equal(
    signing.readSignedOrder(token, "order_test").customer.name,
    "Test Pet Parent",
  );
  assert.throws(() => signing.readSignedOrder(token, "order_other"));
  assert.throws(() =>
    signing.readSignedOrder(token + "tampered", "order_test"),
  );
});

const nextMock = {
  "../../../../lib/api-handlers": {
    handleCreateBooking: async () => {
      throw new Error("Unexpected booking write");
    },
  },
  "next/server": {
    NextResponse: {
      json: (body, options = {}) => ({ status: options.status || 200, body }),
    },
  },
};
test("order endpoint ignores client prices and charges the full canonical cart", async () => {
  let charged;
  const route = load("app/api/booking/order/route.ts", {
    ...nextMock,
    "../../../../lib/db": { query: async () => ({ rows: [] }) },
    "../../../../lib/razorpay": {
      createRazorpayOrder: async (input) => {
        charged = input.amountPaise;
        return { order_id: "order_test", amount: charged };
      },
    },
  });
  const raw = order([
    item({ price: 1 }),
    item({ id: "pet-2", serviceId: "full-grooming", price: 1 }),
  ]);
  const res = await route.POST({ json: async () => raw });
  assert.equal(res.status, 200);
  assert.equal(charged, 264800);
  assert.equal(
    signing.readSignedOrder(res.body.token, "order_test").items.length,
    2,
  );
});
test("database outage prevents creating a payment order", async () => {
  let called = false;
  const route = load("app/api/booking/order/route.ts", {
    ...nextMock,
    "../../../../lib/db": {
      query: async () => {
        throw Error("offline");
      },
    },
    "../../../../lib/razorpay": {
      createRazorpayOrder: async () => {
        called = true;
      },
    },
  });
  assert.equal((await route.POST({ json: async () => order() })).status, 503);
  assert.equal(called, false);
});

function confirmRoute({
  signature = true,
  amount = 44900,
  status = "captured",
  existing = false,
  saveFails = false,
  sessionToken = null,
} = {}) {
  let saves = 0;
  let payload;
  const client = {
    query: async (sql) => ({
      rows:
        sql.startsWith("SELECT id,") && existing
          ? [{ id: "booking_1", booking_ref: "SNS-SAVED" }]
          : [],
    }),
    release: () => {},
  };
  const cache = new Map();
  const route = load(
    "app/api/booking/confirm/route.ts",
    {
      ...nextMock,
      "../../../../lib/db": {
        pool: { connect: async () => client },
        query: async (sql) => ({
          rows: sql.includes("to_regclass")
            ? [{ name: sessionToken ? "booking_payment_sessions" : null }]
            : sessionToken
              ? [{ signed_token: sessionToken }]
              : [],
        }),
      },
      "../../../../lib/razorpay": {
        verifyRazorpaySignature: () => signature,
        razorpayClient: {
          payments: {
            fetch: async () => ({
              order_id: "order_test",
              amount,
              currency: "INR",
              status,
            }),
          },
        },
      },
      "../../../../lib/api-handlers": {
        handleCreateBooking: async (input) => {
          saves++;
          payload = input;
          if (saveFails) throw Error("save failed");
          return {
            status: 201,
            body: { bookingRef: "SNS-TEST", bookingId: "booking_1" },
          };
        },
      },
    },
    cache,
  );
  return {
    route,
    payment: cache.get(path.resolve(root, "lib/booking-payment.ts")).exports,
    saves: () => saves,
    payload: () => payload,
  };
}
const paymentRequest = (raw = order()) => ({
  json: async () => ({
    token: signing.signOrder(raw, "order_test"),
    order_id: "order_test",
    payment_id: "pay_test",
    signature: "test-signature",
  }),
});
test("invalid signatures and wrong amounts never confirm or save", async () => {
  for (const options of [{ signature: false }, { amount: 1 }]) {
    const c = confirmRoute(options);
    const res = await c.route.POST(paymentRequest());
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(c.saves(), 0);
  }
});
test("authorized payments remain pending until captured", async () => {
  const c = confirmRoute({ status: "authorized" });
  const res = await c.route.POST(paymentRequest());
  assert.equal(res.status, 409);
  assert.equal(res.body.success, false);
  assert.equal(c.saves(), 0);
});
test("database save failure never produces a fake confirmation", async () => {
  const c = confirmRoute({ saveFails: true });
  const res = await c.route.POST(paymentRequest());
  assert.equal(res.status, 503);
  assert.equal(res.body.success, false);
  assert.equal(res.body.bookingRef, undefined);
});
test("successful payment saves all services, notes, dates and the full amount", async () => {
  const raw = order([
    item(),
    item({
      id: "pet-2",
      category: "boarding",
      serviceId: "boarding",
      nights: 6,
    }),
  ]);
  const c = confirmRoute({ amount: 357400 });
  const res = await c.route.POST(paymentRequest(raw));
  assert.equal(res.status, 200);
  assert.equal(res.body.bookingRef, "SNS-TEST");
  assert.equal(res.body.services.length, 2);
  assert.equal(c.payload().totalAmount, 3574);
  assert.equal(c.payload().services_json.length, 2);
  assert.match(c.payload().specialInstructions, /Gentle dryer/);
});
test("a repeated payment callback returns the saved booking without creating another", async () => {
  const c = confirmRoute({ existing: true });
  const res = await c.route.POST(paymentRequest());
  assert.equal(res.status, 200);
  assert.equal(res.body.bookingRef, "SNS-SAVED");
  assert.equal(c.saves(), 0);
});

test("webhook recovery saves the complete booking without a browser callback", async () => {
  const c = confirmRoute({
    sessionToken: signing.signOrder(order(), "order_test"),
  });
  const result = await c.payment.recoverCapturedPayment(
    "order_test",
    "pay_test",
  );
  assert.equal(result.bookingRef, "SNS-TEST");
  assert.equal(c.saves(), 1);
  assert.equal(c.payload().totalAmount, 449);
});
test("webhook recovery leaves legacy orders to their existing handler", async () => {
  const c = confirmRoute();
  assert.equal(
    await c.payment.recoverCapturedPayment("order_test", "pay_test"),
    null,
  );
  assert.equal(c.saves(), 0);
});
test("a payment session persistence failure returns no payable order to the browser", async () => {
  const route = load("app/api/booking/order/route.ts", {
    ...nextMock,
    "../../../../lib/db": {
      query: async (sql) => {
        if (sql.startsWith("INSERT")) throw Error("offline");
        return { rows: [] };
      },
    },
    "../../../../lib/razorpay": {
      createRazorpayOrder: async () => ({
        order_id: "order_test",
        amount: 44900,
      }),
    },
  });
  const result = await route.POST({ json: async () => order() });
  assert.equal(result.status, 503);
  assert.equal(result.body.order_id, undefined);
});
