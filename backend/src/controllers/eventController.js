
import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({ user: req.user._id });
    res.json(events);
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const { title, start, end, allDay, description, color } = req.body;

    if (!title || !start || !end) {
        res.status(400);
        throw new Error('Please provide title, start, and end dates');
    }

    const event = await Event.create({
        user: req.user._id,
        title,
        start,
        end,
        allDay,
        description,
        color,
    });

    res.status(201).json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the event user
    if (event.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }


    const { title, start, end, allDay, description, color } = req.body;

    event.title = title || event.title;
    event.start = start || event.start;
    event.end = end || event.end;
    event.description = description !== undefined ? description : event.description;
    event.color = color || event.color;
    event.allDay = allDay !== undefined ? allDay : event.allDay;

    const updatedEvent = await event.save();

    res.json(updatedEvent);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the event user
    if (event.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await event.deleteOne();

    res.json({ id: req.params.id });
});

export { getEvents, createEvent, updateEvent, deleteEvent };
