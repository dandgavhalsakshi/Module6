import React, { useState } from 'react';

const initialAlerts = [
  { message: "Low battery", type: "warning", date: "2025-04-11" },
  { message: "New login detected", type: "info", date: "2025-04-11" },
  { message: "System overload", type: "critical", date: "2025-04-10" },
  { message: "Update available", type: "info", date: "2025-04-09" },
];

const AlertPanel = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const groupByDate = (alerts) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const groups = { "Today": [], "Yesterday": [], "Older": [] };

    alerts.forEach(alert => {
      if (alert.date === today) groups["Today"].push(alert);
      else if (alert.date === yesterday) groups["Yesterday"].push(alert);
      else groups["Older"].push(alert);
    });

    return groups;
  };

  const filtered = initialAlerts.filter(alert =>
    (filter === "all" || alert.type === filter) &&
    alert.message.toLowerCase().includes(search.toLowerCase())
  );

  const groupedAlerts = groupByDate(filtered);

  return (
    <div className="container">
      <div className="title">Smart Alerts</div>
      <div className="subtitle">Stay informed. Stay smart.</div>

      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <input
          type="text"
          placeholder="Search alerts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div id="alertContainer">
        {Object.entries(groupedAlerts).map(([group, alerts]) => (
          alerts.length > 0 && (
            <div key={group}>
              <div className="group-title">{group}</div>
              {alerts.map((alert, idx) => (
                <div key={idx} className={`alert ${alert.type}`}>
                  {alert.message}
                </div>
              ))}
            </div>
          )
        ))}
      </div>

      <div className="quote">“Your system health is your system wealth.”</div>
      <div className="caption">Last updated: just now</div>
    </div>
  );
};

export default AlertPanel;
