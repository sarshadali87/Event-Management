
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { Event } from '../types';
import Modal from '../components/Modal';
import { generateDescription } from '../services/geminiService';
import SparklesIcon from '../components/icons/SparklesIcon';

const EventForm: React.FC<{
  event: Partial<Event> | null;
  onSave: (event: Omit<Event, 'id' | 'bookedTickets'> | Event) => void;
  onClose: () => void;
}> = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Event>>(event || {
    name: '',
    date: '',
    location: '',
    price: 0,
    description: '',
    imageUrl: '',
    totalTickets: 100,
    category: 'Workshops'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleGenerateDescription = async () => {
      if(!formData.name){
          showToast('Please enter an event name first to generate a description.', 'info');
          return;
      }
      setIsGenerating(true);
      try {
          const prompt = `An event called "${formData.name}" in the category "${formData.category}" happening at "${formData.location}"`;
          const desc = await generateDescription(prompt);
          setFormData(prev => ({ ...prev, description: desc }));
      } catch (e) {
          showToast('Failed to generate description.', 'error');
      } finally {
          setIsGenerating(false);
      }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.date && formData.location) {
      onSave(formData as Omit<Event, 'id' | 'bookedTickets'> | Event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" required/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date and Time</label>
        <input type="datetime-local" name="date" value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" required />
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" required/>
        <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50">
           <SparklesIcon className="w-4 h-4" />
           <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" placeholder="https://picsum.photos/seed/..."/>
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Tickets</label>
            <input type="number" name="totalTickets" value={formData.totalTickets} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500">
                <option>Concerts</option>
                <option>Workshops</option>
                <option>Sports</option>
                <option>Community</option>
                <option>Other</option>
            </select>
          </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Event</button>
      </div>
    </form>
  );
};


const AdminDashboardPage: React.FC = () => {
  const { events, createEvent, updateEvent, deleteEvent } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const totalTicketsSold = events.reduce((sum, event) => sum + event.bookedTickets, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.totalTickets, 0);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };
  
  const handleSaveEvent = async (eventData: Omit<Event, 'id' | 'bookedTickets'> | Event) => {
    if ('id' in eventData) {
        await updateEvent(eventData);
    } else {
        await createEvent(eventData);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
        <button onClick={handleOpenCreateModal} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            + Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400">Total Events</h3>
            <p className="text-3xl font-bold mt-2">{events.length}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400">Total Tickets Sold</h3>
            <p className="text-3xl font-bold mt-2">{totalTicketsSold.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400">Total Capacity</h3>
            <p className="text-3xl font-bold mt-2">{totalCapacity.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="p-4 font-semibold">Event Name</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Tickets Sold</th>
                    <th className="p-4 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => (
                    <tr key={event.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-4 font-medium">{event.name}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">
                            {event.bookedTickets} / {event.totalTickets}
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-1">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${(event.bookedTickets / event.totalTickets) * 100}%`}}></div>
                            </div>
                        </td>
                        <td className="p-4 space-x-2">
                           <button onClick={() => handleOpenEditModal(event)} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-md">Edit</button>
                           <button onClick={() => deleteEvent(event.id)} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-md">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? 'Edit Event' : 'Create New Event'}>
        <EventForm event={editingEvent} onSave={handleSaveEvent} onClose={() => setIsModalOpen(false)} />
      </Modal>

    </div>
  );
};

export default AdminDashboardPage;
