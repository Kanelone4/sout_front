const TopPerformers = () => {
  const performers = [
    {
      name: "Franck Duval",
      amount: "342,500 FCFA",
      deals: "27 deals",
      change: "+18%",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        
    },
    {
      name: "Marc Lambert",
      amount: "298,750 FCFA",
      deals: "22 deals",
      change: "+12%",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Julie Moreau",
      amount: "275,200 FCFA",
      deals: "19 deals",
      change: "-5%",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Luc Girard",
      amount: "248,600 FCFA",
      deals: "18 deals",
      change: "+21%",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Steven LaCourbe",
      amount: "228,7O0 FCFA",
      deals: "22 deals",
      change: "+45%",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Meilleurs Commerciaux</h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Voir tous</button>
      </div>

      <div className="space-y-4">
        {performers.map((performer, index) => (
          <div key={index} className="flex items-center space-x-3">
            <img className="w-10 h-10 rounded-full" src={performer.avatar || "/placeholder.svg"} alt={performer.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{performer.name}</p>
              <p className="text-xs text-gray-500">
                {performer.amount} • {performer.deals}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-16 h-2 bg-gray-200 rounded-full mr-3">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${Math.abs(Number.parseInt(performer.change))}%` }}
                ></div>
              </div>
              <span
                className={`text-xs font-medium ${
                  performer.change.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}
              >
                {performer.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPerformers
