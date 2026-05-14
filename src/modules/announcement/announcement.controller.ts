import { Request, Response } from "express";
import * as announcementService from "./announcement.service";

export const getActive = async (req: Request, res: Response) => {
  try {
    const announcement = await announcementService.getActiveAnnouncement();
    res.json(announcement);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const list = await announcementService.getAllAnnouncements();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const [newItem] = await announcementService.createAnnouncement(req.body);
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updatedItem] = await announcementService.updateAnnouncement(parseInt(id as string), req.body);
    if (!updatedItem) return res.status(404).json({ message: "Not found" });
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await announcementService.deleteAnnouncement(parseInt(id as string));
    res.json({ message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
