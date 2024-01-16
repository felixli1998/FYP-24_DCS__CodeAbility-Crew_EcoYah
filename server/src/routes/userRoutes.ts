import express from 'express';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// router.get('/')