import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { MoreHorizontal, Filter } from "lucide-react";
import { useState } from "react";
const Dashboard = () => {
  const [parentActiveTab, setparentActiveTab] = useState("Voucher");
  // Sample data for the area chart
  const chartData = [
    { name: "Sun", value: 15 },
    { name: "Mon", value: 25 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 35 },
    { name: "Thu", value: 40 },
    { name: "Fri", value: 30 },
    { name: "Sat", value: 25 },
  ];

  const transactions = [
    {
      id: "#6545",
      date: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$64",
      statusColor: "bg-green-500",
    },
    {
      id: "#5412",
      date: "01 Oct | 11:29 am",
      status: "Pending",
      amount: "$557",
      statusColor: "bg-yellow-500",
    },
    {
      id: "#6620",
      date: "01 Oct | 11:29 am",
      status: "Paid",
      amount: "$164",
      statusColor: "bg-green-500",
    },
  ];

  const products = [
    {
      name: "CompTIA Voucher",
      id: "Product ID: #Z-456",
      price: "$999.00",
      image: "🎫",
    },
    {
      name: "PTE Voucher",
      id: "",
      price: "$70.00",
      image: "📄",
    },
  ];
  const dateFilterButtons = [
    { label: "Voucher(240)", value: "Voucher" },
    { label: "Vendor(240)", value: "Vendor" },
  ];

  const onTabChange = (value) => {
    setparentActiveTab(value);
    // any other logic on click
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">
                  Total Revenue
                </h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            <div className="mb-4">
              <div className="flex flex-col gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-medium text-gray-900">
                    $350K
                  </span>

                  <span className="text-sm text-gray-600">Sales</span>
                  <span className="text-green-500 text-sm font-medium">
                    ↗ 10.4%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Previous 7days <span className="text-blue-500">($235)</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                Details
              </button>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">
                  Total Orders
                </h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            <div className="mb-4">
              <div className="flex flex-col gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-medium text-gray-900">
                    10.7K
                  </span>

                  <span className="text-sm text-gray-600">order</span>
                  <span className="text-green-500 text-sm font-medium">
                    ↗ 14.4%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Previous 7days <span className="text-blue-500">(7.6k)</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                Details
              </button>
            </div>
          </div>

          {/* PayFast Payments Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">
                  PayFast Payments
                </h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Received</div>
                <div className="text-2xl font-medium text-gray-900">$5091</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Pending</div>
                <div className="text-2xl font-medium text-red-500">$9401</div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Report Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between w-full items-center mb-6">
              <h3 className="text-gray-900 text-xl font-semibold">
                Report for this week
              </h3>
              <div className="flex w-full lg:w-[37%] bg-white border border-[#F0F1F3] p-2 rounded-md">
                {dateFilterButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => onTabChange && onTabChange(button.value)}
                    className={`px-3 py-1 text-sm lato font-medium rounded-md  transition-all
          ${
            parentActiveTab === button.value
              ? "bg-[#3651BF1A] text-black"
              : "bg-transparent text-[#4B5563]"
          }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="border-b-2 border-blue-600 pb-2">
                <div className="text-2xl font-bold text-gray-900">52k</div>
                <div className="text-xs text-gray-500">IT Vouchers Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3.5k</div>
                <div className="text-xs text-gray-500">Deals Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2.5k</div>
                <div className="text-xs text-gray-500">PTE Vouchers Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0.5k</div>
                <div className="text-xs text-gray-500">SPMT Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0.3k</div>
                <div className="text-xs text-gray-500">ApeUni & AllAPTE</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <YAxis
                    domain={[0, 70]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70]}
                    tickFormatter={(value) => `${value}k`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3651BF"
                    strokeWidth={3}
                    fill="url(#chartGradient)"
                  />
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3651BF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3651BF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
              {/* Thursday Tooltip - Fixed position */}
              <div className="absolute top-16 left-[58%] transform -translate-x-1/2 bg-blue-600 text-white px-3 py-2 rounded text-sm">
                Thursday
                <br />
                14k
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-gray-900 text-xl font-semibold">Target</h3>
                <p className="text-gray-500 text-sm">Revenue Target</p>
              </div>
              <MoreHorizontal className="text-gray-400 w-4 h-4" />
            </div>

            {/* Complete Semi-circular Progress (Speedometer) */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-20 mb-6">
                <svg className="w-40 h-20" viewBox="0 0 160 80">
                  {/* Background complete semicircle */}
                  <path
                    d="M 10 70 A 70 70 0 0 1 150 70"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Progress arc (75.55% of semicircle) */}
                  <path
                    d="M 10 70 A 70 70 0 0 1 125 25"
                    stroke="url(#speedometerGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="speedometerGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="text-center mb-2">
                    <div className="text-3xl font-bold text-gray-900">
                      75.55%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mb-4">
                <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">↗</span>
                </div>
                <span className="text-green-500 font-medium">10%</span>
                <span className="text-gray-500">+$150 today</span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 mb-8">
              You succeed earn{" "}
              <span className="font-semibold text-gray-900">$150</span> today,
              its higher than yesterday
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500 mb-2">Target</div>
                <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                  $100k
                  <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs">↗</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Revenue</div>
                <div className="text-lg font-bold text-red-500 flex items-center justify-center gap-1">
                  $75k
                  <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs">↘</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">This Week</div>
                <div className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                  $1.5k
                  <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs">↗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions - Increased Width */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900 font-semibold">Transaction</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">
                      No
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">
                      Order ID
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">
                      Order Date
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-sm text-gray-900">
                        {index + 1}.
                      </td>
                      <td className="py-4 text-sm text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${transaction.statusColor}`}
                          ></div>
                          <span className="text-sm text-gray-900">
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900 font-medium">
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products - Decreased Width */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900 font-semibold">
                Top Products (in Revenue)
              </h3>
              <MoreHorizontal className="text-gray-400 w-4 h-4" />
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    {product.id && (
                      <div className="text-sm text-gray-500">{product.id}</div>
                    )}
                  </div>
                  <div className="font-bold text-gray-900">{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
