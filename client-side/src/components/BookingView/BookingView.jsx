import React from "react";
import { FaTrash } from "react-icons/fa";
import { api } from "../../utility/api";
import { showError, showSuccess } from "../../utility/toast";

const BookingView = ({ booking = {}, onDeleted, mobile = false }) => {
  const id = booking._id || booking.id;

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm("Delete this Booking? This cannot be undone.");
    if (!ok) return;
    try {
      const res = await api.delete(`/bookings/${id}`);
      showSuccess("Booking deleted.");
      onDeleted?.(id);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      console.error("DELETE failed:", status, msg, err);
      showError(`Failed to delete (${status || "?"})${msg ? `: ${msg}` : ""}`);
    }
  };

  if (mobile) {
    return (
      <div className="p-4 flex gap-4">
        <img
          src={booking.imageUrl}
          alt={booking.touristSpotName}
          className="w-24 h-24 object-cover rounded-lg ring-1 ring-white/10"
        />
        <div className="flex-1">
          <h3 className="playfair text-base font-semibold text-base-content line-clamp-1">
            {booking.touristSpotName}
          </h3>
          <p className="work text-xs text-base-content/70 line-clamp-1">
            {booking.countryName} • {booking.location}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={handleDelete} className="btn btn-error btn-xs">
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr>
      <td>
        <div className="avatar">
          <div className="mask mask-squircle w-14 h-14 ring-1 ring-white/10">
            <img src={booking.imageUrl} alt={booking.touristSpotName} />
          </div>
        </div>
      </td>
      <td>
        <div className="playfair font-semibold text-base-content">
          {booking.touristSpotName}
        </div>
      </td>
      <td className="work text-base-content/80">{booking.countryName}</td>
      <td className="work text-base-content/80">{booking.location}</td>
      <td className="text-right">
        <div className="inline-flex items-center gap-2 pr-2">
          <button
            onClick={handleDelete}
            className="btn btn-error btn-sm"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookingView;
