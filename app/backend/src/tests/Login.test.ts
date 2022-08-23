import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

import IUser from '../interfaces/IUser';
import ILogin from '../interfaces/ILogin';

import UserModel from '../database/models/User';
import UserService from '../services/UserService';
import JwtService from '../services/JwtService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login', () => {
  const mockUser: IUser = {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
  };

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCR4aS5IeGsxY3pBTzBuWlIuLkIzOTN1MTBhRUQwUlExTjNQQUVYUTdIeHRMaktQRVpCdS5QVyJ9LCJpYXQiOjE2NjExODk0ODR9.x2LilySNzHKIbtjLBY6zQVZealc_2OBFu5m0UwyS6ys';

  const mockBody: ILogin = {
    email: 'admin@admin.com',
    password: 'secret_admin',
  };

  const mockBodyWithoutEmail = {
    email: '',
    password: 'secret_admin'
  };

  const mockBodyWithoutPass = {
    email: 'admin@admin',
    password: ''
  };

  const incorrectMockBody = {
    email: 'email@email.com',
    password: 'senha_nova'
  };

  const wrongPassMockBody = {
    email: 'admin@admin',
    password: 'outra_senha'
  } 

  describe('login function', () => {
    beforeEach(() => {
      sinon.stub(UserModel, 'findOne').resolves(mockUser as UserModel);
      sinon.stub(jwt, 'sign').resolves(mockToken);
    });
  
    afterEach(() => {
      sinon.restore();
    });

    it('should return an error if email is not passed', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(mockBodyWithoutEmail);

      expect(response.status).to.be.equal(400);
      expect(response.body).to.have.property('message', 'All fields must be filled');
    });

    it('should returns an error if password is not passed', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(mockBodyWithoutPass);
      expect(response.status).to.be.equal(400);
      expect(response.body).to.have.property('message', 'All fields must be filled');
    });

    it('should thrown an error if user is not found', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(incorrectMockBody);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    });

    it('should thrown an error if password is wrong', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(wrongPassMockBody);
    
      expect(response.status).to.be.equal(401);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(mockBody);

      expect(response.status).to.be.equal(200);
    });

    it('should return a token', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(mockBody);

      expect(response.body).to.be.deep.equal({ token: mockToken });
    });
  }),


  describe('getUserRole function', () => {
    beforeEach(() => {
      sinon.stub(JwtService, 'validateToken').resolves('admin')
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/login/validate')
        .send(mockToken);
  
      expect(response.status).to.be.equal(200);
    });

    it('should return user role if token is valid', async () => {
      const response = await chai.request(app)
        .get('/login/validate')
        .send(mockToken);
  
      expect(response.body).to.be.deep.equal({ role: 'admin' });
    });
  });
});
