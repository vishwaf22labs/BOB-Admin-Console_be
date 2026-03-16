import { Request, Response, NextFunction } from "express";

import { getAuthUser } from "../utils/request";
import {
  ListComplaintsQuery,
  ResolveComplaintBody,
} from "../types/complaints.types";
import {
  listComplaintsForUser,
  findComplaintById,
  resolveComplaintForUser,
} from "../services/complaints.service";

export async function listComplaints(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthUser(req);

    const query = req.query as ListComplaintsQuery;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await listComplaintsForUser(user, {
      ...query,
      search,
      page,
      limit,
    });

    return res.json({
      complaints: result.complaints,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

export async function getComplaintById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthUser(req);
    const uuid = req.params.id as string;

    const complaint = await findComplaintById(uuid);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (user.role !== "super_admin" && complaint.userBankId !== user.bankId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json({ complaint });
  } catch (err) {
    next(err);
  }
}

export async function resolveComplaint(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = getAuthUser(req);
    const uuid = req.params.id as string;
    const body = req.body as ResolveComplaintBody;

    if (!body.resolutionNote) {
      return res.status(400).json({ message: "resolutionNote is required" });
    }

    const complaint = await findComplaintById(uuid);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (user.role !== "super_admin" && complaint.userBankId !== user.bankId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await resolveComplaintForUser(user, complaint, body);

    return res.json({ complaint: updated });
  } catch (err) {
    next(err);
  }
}