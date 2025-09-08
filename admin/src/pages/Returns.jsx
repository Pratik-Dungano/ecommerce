import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

const Returns = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState("");

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        const withRequests = (res.data.orders || []).filter(o => !!o.returnRequest);
        setOrders(withRequests.sort((a,b)=> new Date(b.returnRequest?.requestedAt||0) - new Date(a.returnRequest?.requestedAt||0)));
      } else {
        toast.error(res.data.message || "Failed to fetch return requests");
      }
    } catch (err) {
      toast.error("Failed to fetch return requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchReturns(); }, [token]);

  const actOnRequest = async (orderId, action) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/handle-return`,
        { orderId, action, adminNote: actionNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        toast.success("Updated");
        setActionNote("");
        fetchReturns();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold mb-6">Returns & Replacements</h3>
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No return/replacement requests.</p>
      )}

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-3 mb-3">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                <p className="text-xs text-gray-400">Requested: {order.returnRequest?.requestedAt ? new Date(order.returnRequest.requestedAt).toLocaleString() : '-'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded bg-gray-100">{order.returnRequest?.type}</span>
                <span className="px-2 py-1 text-xs rounded bg-gray-100">{order.returnRequest?.status}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-sm">
                <p className="font-medium">Customer</p>
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p className="text-gray-500 text-xs">{order.address.email}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Reason</p>
                <p className="text-gray-600 whitespace-pre-wrap">{order.returnRequest?.reason || '-'}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Photos</p>
                <div className="flex flex-wrap gap-2">
                  {(order.returnRequest?.photos || []).map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt="evidence" className="w-16 h-16 object-cover rounded border" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
              <input
                type="text"
                placeholder="Admin note (optional)"
                value={actionNote}
                onChange={(e)=>setActionNote(e.target.value)}
                className="border rounded px-3 py-2 text-sm flex-1"
              />
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>actOnRequest(order._id,'approve')} className="px-3 py-2 text-sm bg-green-600 text-white rounded">Approve</button>
                <button onClick={()=>actOnRequest(order._id,'pickup_scheduled')} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded">Schedule Pickup</button>
                <button onClick={()=>actOnRequest(order._id,'picked')} className="px-3 py-2 text-sm bg-indigo-500 text-white rounded">Mark Picked</button>
                <button onClick={()=>actOnRequest(order._id,'received')} className="px-3 py-2 text-sm bg-indigo-400 text-white rounded">Mark Received</button>
                <button onClick={()=>actOnRequest(order._id,'refunded')} className="px-3 py-2 text-sm bg-teal-600 text-white rounded">Mark Refunded</button>
                <button onClick={()=>actOnRequest(order._id,'reject')} className="px-3 py-2 text-sm bg-red-600 text-white rounded">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Returns;


