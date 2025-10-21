import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DiscoverPeople from "../components/DiscoverPeople";
import { fetchAllUsers } from "@/api/authApi";
import "@/assets/styles/DiscoverPeople.css";
import { LiquedLoader } from "@/components/loaders";

export default function DiscoverPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchAllUsers();
        if (Array.isArray(res)) {
          setUsers(res);
        } else if (res.data && Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("Invalid users response", res);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="discover-page">
      <header className="discover-header">
        <h1 className="discover-title">Discover People</h1>
        <div className="user-count-badge">{users.length} users</div>
      </header>

      {loading ? (
        <div className="page-loader">
          <LiquedLoader label="ব্যবহারকারীরা লোড হচ্ছে..." />
        </div>
      ) : (
        <DiscoverPeople users={users} />
      )}

      <footer className="discover-footer">
        <Link
          className="plain-link"
          to="/">
          ← Back Home
        </Link>
      </footer>
    </div>
  );
}
