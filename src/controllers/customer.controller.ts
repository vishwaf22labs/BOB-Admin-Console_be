import type { Request, Response, NextFunction } from "express";
import { getTableColumns } from "drizzle-orm";

import { db } from "../db/client";
import { customers } from "../db/schema";
import type { CreateCustomerBody } from "../types/customer.types";
import { customerSchema } from "../validation/customer.schema";

export async function createCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = req.body as CreateCustomerBody;

    const parsed = customerSchema.safeParse(body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid customer data",
        errors: parsed.error.flatten(),
      });
    }

    const validData = parsed.data;

    const { id: _id, ...customerColumns } = getTableColumns(customers);

    const [inserted] = await db
      .insert(customers)
      .values({
        name: validData.name.trim(),
        email: validData.email.trim(),
        phone: validData.phone.trim(),
        channelMode: validData.channelMode,
      })
      .returning(customerColumns);

    return res.status(201).json({ customer: inserted });
  } catch (err) {
    next(err);
  }
}