import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/history");

      setHistory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (score) => {
    if (score >= 90) return "bg-green-500";

    if (score >= 75) return "bg-blue-500";

    if (score >= 60) return "bg-yellow-500";

    return "bg-red-500";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold">Analysis History</h1>

            <p className="mt-3 text-slate-100">
              View all saved repository analyses.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {loading && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-600">Loading...</h2>
            </div>
          )}

          {!loading && history.length === 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
              <h2 className="text-2xl font-bold">No Analysis Found</h2>

              <p className="text-slate-500 mt-2">
                Analyze and save a repository first.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                {/* Repo Name */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      {item.owner}/{item.repository}
                    </h2>

                    <p className="text-slate-500 mt-1">{item.projectType}</p>
                  </div>

                  <span
                    className={`${getGradeColor(
                      item.overallScore,
                    )} text-white px-3 py-1 rounded-full text-sm font-bold`}
                  >
                    {item.overallScore}
                  </span>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-green-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Health</p>

                    <h3 className="font-bold text-green-700">
                      {item.healthScore}
                    </h3>
                  </div>

                  <div className="bg-blue-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">README</p>

                    <h3 className="font-bold text-blue-700">
                      {item.readmeScore}
                    </h3>
                  </div>

                  <div className="bg-purple-100 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Overall</p>

                    <h3 className="font-bold text-purple-700">
                      {item.overallScore}
                    </h3>
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-5">
                  <h4 className="font-semibold mb-2">Languages</h4>

                  <div className="flex flex-wrap gap-2">
                    {item.languages &&
                      Object.keys(item.languages).map((lang) => (
                        <span
                          key={lang}
                          className="bg-slate-200 px-3 py-1 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Date */}
                <div className="mt-5 pt-4 border-t">
                  <p className="text-sm text-slate-500">Saved on</p>

                  <p className="font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
