import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';


describe('/api/users/signup', () => {

  beforeEach(() => {

    process.env.BASE_URL = "https://www.test.com"
    jest.resetAllMocks();
  })

  const email = 'test@test.com';
  const password = 'Password12341!';
  const passwordConfirmation = password;
  const fullName = 'Jest Test'

  const test = async (data: any, result: number) => {
    return request(app)
      .post('/api/users/signup')
      .send(data)
      .expect(result);
  }

  it('should return 400 with an invalid email', async () => {
    await test({
      email: 'test@test', // invalid
      password,
      passwordConfirmation,
      fullName
    }, 400)
  });

  it('should return 400 with an invalid password', async () => {
    await test({
      email,
      password: 'invalid',
      passwordConfirmation: 'invalid',
      fullName
    }, 400)
  });

  it('should return 400 with missing email', async () => {
    await test({
      password,
      passwordConfirmation,
      fullName
    }, 400);
  });

  it('should return 400 with missing password', async () => {
    await test({
      email,
      passwordConfirmation,
      fullName
    }, 400);
  });

  it('should return 400 with missing password confirmation', async () => {
    const response = await test({
      email,
      password,
      fullName
    }, 400);

    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].field).toEqual("passwordConfirmation")
    expect(response.body.errors[0].message).toEqual("Password confirmation does not match password")
  });


  it('should only accept strong passwords and reject with an error message', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email,
        password: 'password',
        passwordConfirmation: 'password',
        fullName
      })

    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].field).toEqual("password")
    expect(response.body.errors[0].message).toEqual("The password must be at least 10 characters long. The password must contain at least one uppercase letter. The password must contain at least one number. The password must contain at least one special character.")
  })

  it('should disallow duplicate emails', async () => {

    await test({
      email,
      password,
      passwordConfirmation,
      fullName
    }, 200);

    return test({
      email,
      password,
      passwordConfirmation,
      fullName
    }, 400)
  });

  it('should return 200 on successful signup', async () => {
    await test({
      email,
      password,
      passwordConfirmation,
      fullName
    }, 200);

    const regExp = /{\"email\":\"test@test.com\",\"link\":\"https:\/\/www.test.com\/api\/users\/verify-email\/\w{32}\"}/

    expect(natsWrapper.client.publish)
    .toHaveBeenLastCalledWith(
      "user:signed-up",
      expect.stringMatching(regExp),
      expect.any(Function)
      )
  });

  it('should create an admin when the email set in the env variables match', async () => {
    process.env.ADMIN_EMAIL = email;

    await test({
      email,
      password,
      passwordConfirmation,
      fullName
    }, 200);

    const users = await User.find({ email });

    expect(users[0].isAdmin).toBeTruthy();
  })


})