import { test, expect } from 'playwright-test-coverage';

test('not found page', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.getByRole('main')).toContainText('Oops');
});

test('docs page', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');
});

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes }); 
  });

  await page.route('https://pizza-factory.cs329.click/api/order/verify', async (route) => {
    const verifyReq = { jwt: "eyJpYXQ" };
    const verifyRes = {
      "message": "valid",
      "payload": {
        "vendor": {
          "id": "dms267",
          "name": "Dylan Shuldberg",
          "created": "2024-06-01T00:00:00Z",
          "validUntil": "2025-12-31T23:59:59Z"
        },
        "diner": {
          "name": "Kai Chen",
        },
        "order": {
          "pizzas": [
            "Veggie",
            "Pepperoni"
          ]
        }
      }
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(verifyReq);
    await route.fulfill({ json: verifyRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();

  // Verify
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.locator('h3')).toContainText('JWT Pizza - valid');
});

test('diner dashboard', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 1, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "dinerId": 4,
      "orders": [
        {
          "id": 1,
          "franchiseId": 1,
          "storeId": 1,
          "date": "2024-06-01T00:00:00Z",
          "items": [
            {
              "id": 1,
              "menuId": 1,
              "description": "Veggie",
              "price": 0.0038
            },
            {
              "id": 2,
              "menuId": 2,
              "description": "Pepperoni",
              "price": 0.0042
            }
          ]
        }
      ],
      "page": 1
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Visit Dashboard
  await page.getByRole('link', { name: 'KC' }).click();
  await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
});

test('register', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = { email: 'register@test.com', password: 'a', name: 'Register Test' };
    const registerRes = { user: { id: 1, name: 'Register Test', email: 'register@test.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Register Test');
  await page.getByRole('textbox', { name: 'Email address' }).fill('register@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByRole('link', { name: 'RT' })).toBeVisible();
});

test('logout', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    if(route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 });
    }
    if(route.request().method() === 'PUT') {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 1, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('navigation', { name: 'Global' }).getByRole('link', { name: 'Logout' })).toBeVisible();
});

test('about page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
});

test('history page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('main')).toContainText('Mama Rucci, my my');
});

test('franchise page unauthenticated', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
});

test('franchise page authenticated', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
    const loginRes = { user: { id: 1, name: 'pizza franchisee', email: 'f@jwt.com', roles: [{ role: 'franchisee' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "stores": [
          {
            "id": 1,
            "name": "SLC"
          }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/1', async (route) => {
    const franchiseRes = [
      {
        "id": 2,
        "name": "pizzaPocket",
        "admins": [
          {
            "id": 4,
            "name": "pizza franchisee",
            "email": "f@jwt.com"
          }
        ],
        "stores": [
          {
            "id": 4,
            "name": "SLC",
            "totalRevenue": 0
          }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/2/store', async (route) => {
    const storeRes = [
      {
        "id": 4,
        "name": "SLC",
        "totalRevenue": 0
      }
    ];
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: storeRes });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('f@jwt.com');
  await page.getByPlaceholder('Password').fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('pizzaPocket')).toContainText('pizzaPocket');

  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByRole('main')).toContainText('Create store');
  await page.getByRole('textbox', { name: 'Store name' }).fill('SLC');
  await page.getByRole('button', { name: 'Create' }).click();
});

test('admin pages', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'admin@test.com', password: 'a' };
    const loginRes = { user: { id: 1, name: 'Admin Test', email: 'admin@test.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const franchiseReq = {"name": "pizzaPocket", "admins": [{"email": "admin@test.com"}]};
      const franchiseRes = {
        "name": "pizzaPocket",
        "admins": [
          {
            "id": 4,
            "name": "pizza franchisee",
            "email": "admin@test.com",
            "role": "admin",
          }
        ],
        "id": 1
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    } 
    else if (route.request().method() === 'GET') {
      const franchiseRes = [
        {
          "id": 2,
          "name": "pizzaPocket",
          "stores": [
            {
              "id": 4,
              "name": "SLC"
            }
          ]
        }
      ];
      await route.fulfill({ json: franchiseRes });
    }
  });

  await page.route('*/**/api/franchise/1', async (route) => {
    const franchiseRes = [
      {
        "id": 2,
        "name": "pizzaPocket",
        "admins": [
          {
            "id": 4,
            "name": "pizza franchisee",
            "email": "admin@test.com",
            "role": "admin",
          }
        ],
        "stores": [
          {
            "id": 4,
            "name": "SLC",
            "totalRevenue": 0
          }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/2', async (route) => {
    const franchiseRes = {
      "message": "franchise deleted"
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/franchise/2/store/4', async (route) => {
    const storeRes = {
      "message": "store deleted"
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: storeRes });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Email address').fill('admin@test.com');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('main')).toContainText("Mama Ricci's kitchen");

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('Create franchise');
  await page.getByRole('textbox', { name: 'Franchise name' }).fill('pizzaPocket');
  await page.getByRole('textbox', { name: 'Franchisee admin email' }).fill('admin@test.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.getByRole('row', { name: 'pizzaPocket Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('row', { name: 'SLC ₿ Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();
});