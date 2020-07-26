import express, { Request, Response, NextFunction } from 'express';
import { currentUser, BadRequestError, validateRequest } from '@ramsy-dev/microservices-shop-common';
import { Cart } from '../models/cart';

const router = express.Router();

router.get(
  '/api/cart', 
  currentUser, 
  async (req: Request, res: Response) => {
  // Check if we have a cart for the current user
  if (req.currentUser) {
    const existingCart = await Cart.findOne({ userId: req.currentUser?.id });
    // Return existing cart
    if (existingCart) {
      return res.send(existingCart);
    }

    const newCart = Cart.build({ userId: req.currentUser.id });

    await newCart.save();
    
    return res.send(newCart);
  }

  // Check if we have a cart for the current guest user
  if (req.session?.guestId) {
    const existingCart = await Cart.findOne({ guestId: req.session.guestId });
    // Return existing cart
    if (existingCart) {
      return res.send(existingCart);
    }

    const newCart = Cart.build({ guestId: req.session.guestId });

    await newCart.save();

    return res.send(newCart);
  }

  res.send({})
});

export { router as indexCartRouter };
