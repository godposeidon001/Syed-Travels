import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utility/api";
import { showError } from "../../utility/toast";
import useTitle from "../../utility/useTitle";
import ListView from "../ListView/ListView";

const MyList = () => {
  useTitle("My List");
  const { user, loading } = useContext(AuthContext);
  const [spots, setSpots] = useState([]);
  const [fetching, setFetching] = useState(true);
  const apiBase = import.meta.env.VITE_API_URL;

  const loadSpots = async () => {
    if (!user?.uid) return;
    try {
      setFetching(true);
      const { data } = await api.get(`/myspots/${user.uid}`);
      setSpots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showError("Failed to load your spots.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.uid) {
      loadSpots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.uid]);

  const removeFromState = (id) =>
    setSpots((prev) => prev.filter((s) => (s._id || s.id) !== id));

  return (
    <main className="mt-8 md:mt-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="playfair text-3xl md:text-4xl font-bold text-base-content">
            My List
          </h1>
          <p className="work text-base-content/70 mt-2 md:text-lg">
            Places you've added.
          </p>
        </header>

        {fetching ? (
          <div className="min-h-[30vh] grid place-items-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : spots.length === 0 ? (
          <div className="card bg-base-200/70 ring-1 ring-white/10 shadow-xl p-8 text-center">
            <p className="work text-base-content/70">
              You haven't added any spots yet.
            </p>
          </div>
        ) : (
          <div className="card bg-base-200/70 ring-1 ring-white/10 shadow-xl overflow-x-auto">
            <table className="hidden md:table table-fixed">
              <thead>
                <tr className="text-base-content/70">
                  <th>Image</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Location</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <ListView
                    key={spot._id || spot.id}
                    spot={spot}
                    apiBase={apiBase}
                    onDeleted={removeFromState}
                  />
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y divide-base-300/60">
              {spots.map((spot) => (
                <ListView
                  key={spot._id || spot.id}
                  spot={spot}
                  apiBase={apiBase}
                  onDeleted={removeFromState}
                  mobile
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyList;
