import React from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { api } from "../../utility/api";
import { showError, showSuccess } from "../../utility/toast";

const ListView = ({ spot = {}, onDeleted, mobile = false }) => {
  const id = spot._id || spot.id;
  const editHref = `/edit-spot/${id}`;

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm("Delete this spot? This cannot be undone.");
    if (!ok) return;
    try {
      const res = await api.delete(`/spots/${id}`);
      showSuccess("Spot deleted.");
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
          src={spot.imageUrl}
          alt={spot.touristSpotName}
          className="w-24 h-24 object-cover rounded-lg ring-1 ring-white/10"
        />
        <div className="flex-1">
          <h3 className="playfair text-base font-semibold text-base-content line-clamp-1">
            {spot.touristSpotName}
          </h3>
          <p className="work text-xs text-base-content/70 line-clamp-1">
            {spot.countryName} • {spot.location}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <NavLink to={editHref} className="btn btn-ghost btn-xs">
              <FaEye />
            </NavLink>
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
            <img src={spot.imageUrl} alt={spot.touristSpotName} />
          </div>
        </div>
      </td>
      <td>
        <div className="playfair font-semibold text-base-content">
          {spot.touristSpotName}
        </div>
      </td>
      <td className="work text-base-content/80">{spot.countryName}</td>
      <td className="work text-base-content/80">{spot.location}</td>
      <td className="text-right">
        <div className="inline-flex items-center gap-2 pr-2">
          <NavLink
            to={editHref}
            className="btn btn-ghost btn-sm"
            title="View / Edit"
          >
            <FaEye />
          </NavLink>
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

export default ListView;
