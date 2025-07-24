import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal, Filter } from "lucide-react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const percentage = 75.55;
  const [parentActiveTab, setparentActiveTab] = useState("Voucher");
  const [chartData, setChartData] = useState([
    { name: "Sun", value: 15 },
    { name: "Mon", value: 25 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 35 },
    { name: "Thu", value: 40 },
    { name: "Fri", value: 30 },
    { name: "Sat", value: 25 },
  ]);
  const [targetProgress, setTargetProgress] = useState(75.55);
  const [dailyIncrease, setDailyIncrease] = useState(10);
  const [dailyEarnings, setDailyEarnings] = useState(150);
  const [target, setTarget] = useState(100000);
  const [revenue, setRevenue] = useState(75000);
  const [thisWeek, setThisWeek] = useState(1500)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyTarget, setMonthlyTarget] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setMonthlyTarget(''); // Reset input on close
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the monthly target submission, e.g., send to an API
    const newTarget = Math.max(0, Math.min(100, Number(monthlyTarget)));
    setMonthlyTarget(newTarget);
    handleCloseModal();
  };

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
    { label: "This Week", value: "Voucher" },
    { label: "Last Week", value: "Vendor" },
  ];

  const onTabChange = (value) => {
    setparentActiveTab(value);
    // any other logic on click
  };

  // Fetch data from API (simulated with static data for now)
  useEffect(() => {
    const fetchChartData = async () => {
      // Replace with actual API call
      // const response = await fetch('your-api-endpoint');
      // const data = await response.json();
      // setChartData(data);
    };
    fetchChartData();

    // Simulate dynamic target data (replace with API call)
    const fetchTargetData = async () => {
      // const response = await fetch('your-target-api-endpoint');
      // const data = await response.json();
      // setTargetProgress(data.progress);
      // setDailyIncrease(data.dailyIncrease);
      // setDailyEarnings(data.dailyEarnings);
      // setTarget(data.target);
      // setRevenue(data.revenue);
      // setThisWeek(data.thisWeek);
    };
    fetchTargetData();
  }, []);

  const getArcPath = (progress) => {
    const angle = (progress / 100) * 180;
    const radius = 35;
    const x = 80 + radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = 70 + radius * Math.sin((angle - 90) * Math.PI / 180);
    return `M 10 70 A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0},1 ${x} ${y}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between gap-2">
          <div className="flex justify-between items-start ">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">
                  Total Revenue
                </h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
              {/* <MoreHorizontal className="text-gray-400 w-5 h-5" /> */}
            </div>
            <div className="">
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-medium text-gray-900">
                    Rs.350K
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
          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start ">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">
                  Total Orders
                </h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
              {/* <MoreHorizontal className="text-gray-400 w-5 h-5" /> */}
            </div>
            <div className="">
              <div className="flex flex-col gap-4 ">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-medium text-gray-900">
                   Rs.10.7K
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
          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start ">
              <div>
                <h3 className="text-gray-900 text-lg font-semibold">
                  PayFast Payments
                </h3>
                <p className="text-gray-500 text-sm">Last 7 days</p>
              </div>
              {/* <MoreHorizontal className="text-gray-400 w-5 h-5" /> */}
            </div>
            <div className="flex flex-col items-start gap-1">
              {/* <div> */}
                <div className="text-sm text-gray-600 ">Received</div>
                <div className="text-4xl font-semibold text-gray-900">Rs.5091</div>
              {/* </div> */}
              {/* <div>
                <div className="text-sm text-gray-600 mb-2">Pending</div>
                <div className="text-2xl font-medium text-red-500">$9401</div>
              </div> */}
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
              <div className="flex  bg-[#3651BF1A]  p-1 rounded-md">
                {dateFilterButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => onTabChange && onTabChange(button.value)}
                    className={`px-2 py-1 text-sm lato font-medium rounded-md  transition-all
          ${
            parentActiveTab === button.value
              ? "bg-white text-black"
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
                  <Tooltip
                    contentStyle={{ backgroundColor: '#3651BF', color: 'white', borderRadius: '4px', padding: '5px' }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value) => `${value}k`}
                    labelFormatter={(label) => label}
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
            </div>
          </div>

          {/* Target Card */}
          <div className="bg-white rounded-xl shadow-md p-4 w-80">
            <div className="flex justify-between">
              <div>
              <h2 className="text-lg font-semibold">Target</h2>
      <p className="text-sm text-gray-500 mb-4">Revenue Target</p>
              </div>
              <MoreHorizontal className="text-gray-400 w-5 h-5" 
              onClick={handleOpenModal}
              />
            </div>
      

      <div className="w-68  mx-auto mb-2">
        {/* <CircularProgressbarWithChildren
          value={monthlyTarget}
          maxValue={100}
          circleRatio={0.5}
          styles={buildStyles({
            rotation: 0.75, // starts from bottom-center
            strokeLinecap: "round",
            pathColor: "#3b82f6",
            trailColor: "#e5e7eb",
            textColor: "#000"
          })}
        >
          <div className="text-xl font-semibold">{monthlyTarget}%</div>
        </CircularProgressbarWithChildren> */}
      

      <div className="relative">
      {/* Injecting the gradient into the DOM */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="bg-gradient-custom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2BB2FE" />
            <stop offset="100%" stopColor="#22CAAD" />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgressbarWithChildren
        value={monthlyTarget}
        maxValue={100}
        circleRatio={0.5}
        styles={buildStyles({
          rotation: 0.75,
          strokeLinecap: "round",
          pathColor: "url(#bg-gradient-custom)", // Use '#' here!
          trailColor: "#e5e7eb",
          textColor: "#000",
        })}
      >
        <div className="absolute top-10 text-sm font-medium mt-4 flex flex-col justify-center items-center">
          {monthlyTarget}%
         <div> 
          <span className="text-green-500 font-semibold">10% ▲</span> +$150 today
         </div>
          </div>
      </CircularProgressbarWithChildren>
    </div>
      </div>

      <div className="text-center text-sm mb-4">
        
      </div>

      <p className="text-center text-gray-600 text-sm mb-4">
        You succeed earn <span className="font-semibold">$150</span> today, it's higher than yesterday
      </p>

      <div className="flex justify-between text-sm text-gray-700">
        <div className="text-center">
          <p className="font-semibold">$100k</p>
          <p className="text-gray-500">Target</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-red-500">$75k</p>
          <p className="text-gray-500">Revenue</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">$1.5k</p>
          <p className="text-gray-500">This Week</p>
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
              {/* <MoreHorizontal className="text-gray-400 w-4 h-4" /> */}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center backdrop-blur-md bg-gray-800/30 justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Set Monthly Target</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="monthlyTarget" className="block text-sm font-medium text-gray-700">
                  Monthly Target
                </label>
                <input
                  type="number"
                  id="monthlyTarget"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(e.target.value)}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter target amount"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;