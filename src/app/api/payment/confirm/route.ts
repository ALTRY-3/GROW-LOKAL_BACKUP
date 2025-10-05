import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { retrievePaymentIntent } from '@/lib/paymongo/client';

// POST /api/payment/confirm - Confirm payment and update order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { orderId, paymentIntentId, paymentMethodId } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { success: false, message: 'Order ID and Payment Intent ID are required' },
        { status: 400 }
      );
    }

    // Find the order
    // Check if orderId is a valid MongoDB ObjectId (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(orderId);
    
    const order = await Order.findOne(
      isValidObjectId
        ? { $or: [{ orderId }, { _id: orderId }] }
        : { orderId } // Only search by readable orderId if not valid ObjectId
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Retrieve payment intent from PayMongo
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);

    // Check payment status
    if (paymentIntent.attributes.status === 'succeeded') {
      // Mark order as paid
      await order.markAsPaid(paymentIntentId);

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          orderId: order.orderId,
          paymentStatus: 'paid',
          orderStatus: order.status,
        },
      });
    } else if (paymentIntent.attributes.status === 'awaiting_payment_method') {
      return NextResponse.json({
        success: false,
        message: 'Payment is still awaiting payment method',
        data: {
          status: paymentIntent.attributes.status,
        },
      }, { status: 400 });
    } else if (paymentIntent.attributes.status === 'processing') {
      return NextResponse.json({
        success: false,
        message: 'Payment is still processing',
        data: {
          status: paymentIntent.attributes.status,
        },
      }, { status: 400 });
    } else {
      // Payment failed
      order.paymentDetails.status = 'failed';
      await order.save();

      return NextResponse.json({
        success: false,
        message: 'Payment failed',
        data: {
          status: paymentIntent.attributes.status,
          lastPaymentError: paymentIntent.attributes.last_payment_error,
        },
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to confirm payment' 
      },
      { status: 500 }
    );
  }
}
