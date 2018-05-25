const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});


describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('When logged in, I can see the blog create form.', async () => {
    const label = await page.getContentsOf('form label'); 
    expect(label).toEqual('Blog Title');
  });

  describe('When using valid inputs', async () => {
    beforeEach(async () => {
      await page.waitFor('.title');
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('Submitting takes user to a review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting adds blog to index page.', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');
      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('Using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('The form shows an error message.', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not loggin in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C',
      },
    },
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);
    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
// Jest allows to execute multiple copies in paralell. Mocha does it one at time
// Takes much longer w\ Mocha.