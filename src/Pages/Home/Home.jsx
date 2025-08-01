import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MoreHorizontal, Filter } from "lucide-react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { fetchResults } from "../../Services/GetResults";

import Loader from "../../Components/Loader/Loader"

import FormatNumber from "../../Components/Formatter/Format";

const Dashboard = () => {
  const [parentActiveTab, setparentActiveTab] = useState("week");
  const [days, setDays] = useState(7); // Default to 7 days for week

  const {
    data: ResultsApi,
    isLoading,
    error,
  } = fetchResults("total-revenue", "/api/admin/total-revenue/");
 
  const {
    data: PayFastPaymentCount,
    isLoading:PayFastPaymentLoading,
    error:PayFastPaymentError,
  } = fetchResults("total-revenue", "/api/admin/total-payment-count/");

  const {
    data: graphData,
    isLoading:graphDataLoading,
    error:graphDataError,
    refetch: refetchGraphData,
  } = fetchResults("graph-Data", `/api/admin/graph-data/?days=${days}`);

  const rawStatusCounts = PayFastPaymentCount?.data?.status_counts || {};

  const filteredCards = Object.entries(rawStatusCounts)
    .filter(([status]) => status === "PENDING" || status === "COMPLETED")
    .map(([status, value]) => ({
      status,
      count: value.count,
      total_amount: value.total_amount,
    }));
  
  // Separate them
  const completed =(filteredCards.find(item => item.status === "COMPLETED") || { count: 0, total_amount: 0 });
  const pending = filteredCards.find(item => item.status === "PENDING") || { count: 0, total_amount: 0 };

  const percentage = 75.55;
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
  const [thisWeek, setThisWeek] = useState(1500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyTarget, setMonthlyTarget] = useState("");

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
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  const onTabChange = (value) => {
    setparentActiveTab(value);
    // Set days based on selected tab and refetch data
    const newDays = value === "week" ? 7 : 30;
    setDays(newDays);
  };

  // Effect to refetch data when days change
  useEffect(() => {
    if (refetchGraphData) {
      refetchGraphData();
    }
  }, [days, refetchGraphData]);

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
    const x = 80 + radius * Math.cos(((angle - 90) * Math.PI) / 180);
    const y = 70 + radius * Math.sin(((angle - 90) * Math.PI) / 180);
    return `M 10 70 A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0},1 ${x} ${y}`;
  };

  // Get API data with fallbacks
  const apiData = graphData?.data || {};
  const vouchersTotal = apiData?.vouchers?.total || 0;
  const dealsTotal = apiData?.deals?.total || 0;
  const alphaPteTotal = apiData?.alpha_pte?.total || 0;
  
  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Top Stats Row */}
        {
          isLoading && PayFastPaymentLoading ?
          <Loader/>
          
          : error && PayFastPaymentError ?(
            <div className="flex justify-center text-red-400 items-center h-20">
            Error Fetching Data
          </div>
          )
          : 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          
  {[
   {
    title: "Total Orders",
    value: FormatNumber(ResultsApi?.data?.total_orders ?? 0),
  },
  {
    title: "Total Revenue",
    value: `Rs. ${FormatNumber (ResultsApi?.data?.total_revenue ?? 0)}`,
  },
  ].map((card, index) => (
    <div
      key={index}
      className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between gap-2"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-900 text-lg font-semibold">{card.title}</h3>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <div className="flex flex-col gap-1">
              <span className="text-4xl font-medium text-gray-900">
                {card.value}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
          Details
        </button>
      </div>
    </div>
  ))}
 
 <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col gap-4">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-gray-900 text-lg font-semibold">PayFastPayment</h3>
      {/* <p className="text-gray-500 text-sm">Status Summary</p> */}
    </div>
  </div>

  <div className="flex justify-between gap-6">
    {/* Completed Block */}
    <div className="flex flex-col gap-1 flex-1 border-r pr-4">
      <div className="text-sm text-green-900">Completed</div>
      <span className="text-2xl font-medium text-green-600">Rs.{FormatNumber(completed.total_amount.toFixed(2))}</span>
      {/* <span className="text-sm text-gray-600">Rs.</span> */}
      {/* <span className="text-green-700 text-sm font-medium">{completed.count} orders</span> */}
    </div>

    {/* Pending Block */}
    <div className="flex flex-col gap-1 flex-1 pl-4">
      <div className="text-sm text-yellow-600">Pending</div>
      <span className="text-2xl font-medium text-yellow-500">Rs.{FormatNumber(pending.total_amount.toFixed(2))}</span>
      {/* <span className="text-sm text-gray-600">PKR</span> */}
      {/* <span className="text-yellow-700 text-sm font-medium">{pending.count} orders</span> */}
    </div>
  </div>

  <div className="flex justify-end items-center">
    <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition-colors">
      Details
    </button>
  </div>
</div>

</div>
}

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Report Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between w-full items-center mb-6">
              <h3 className="text-gray-900 text-xl font-semibold ">
                Report for {parentActiveTab === "week" ? "this week" : "this month"}
              </h3>
              <div className="flex  bg-[#3651BF1A]  p-1 rounded-md">
                {dateFilterButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => onTabChange && onTabChange(button.value)}
                    className={`cursor-pointer px-2 py-1 text-sm lato font-medium rounded-md  transition-all
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

            {/* Stats Row - Now showing API data */}
            {graphDataLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader />
              </div>
            ) : graphDataError ?(
              <div>
                <div className="flex justify-center text-red-400 items-center h-20">
                Error Fetching Data
              </div>
              </div>
            )
            
            : (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border-b-2 border-blue-600 pb-2">
                  <div className="text-2xl font-bold text-gray-900">{FormatNumber(vouchersTotal)}</div>
                  <div className="text-xs text-gray-500">IT Vouchers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{FormatNumber(dealsTotal)}</div>
                  <div className="text-xs text-gray-500">Deals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{FormatNumber(alphaPteTotal)}</div>
                  <div className="text-xs text-gray-500">Alpha PTE </div>
                </div>
              </div>
            )}

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
                    contentStyle={{
                      backgroundColor: "#3651BF",
                      color: "white",
                      borderRadius: "4px",
                      padding: "5px",
                    }}
                    itemStyle={{ color: "white" }}
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
              <MoreHorizontal
                className="text-gray-400 w-5 h-5"
                onClick={handleOpenModal}
              />
            </div>

            <div className="w-68  mx-auto">
              
              <div className="relative">
                {/* Injecting the gradient into the DOM */}
                <svg className="absolute w-0 h-0">
                  <defs>
                    <linearGradient
                      id="bg-gradient-custom"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
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
                  <div className=" text-sm font-medium mt-14 flex flex-col justify-center items-center">
                    {monthlyTarget}%
                    <div>
                      <span className="text-green-500 font-semibold">
                        10% ▲
                      </span>{" "}
                      +$150 today
                    </div>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
              
            </div>

            {/* <div className="text-center text-sm mb-"></div> */}

            <p className="text-center text-gray-600 text-sm mb-1">
              You earned <span className="font-semibold">$150</span>{" "}
              today, it's higher than yesterday
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
                <label
                  htmlFor="monthlyTarget"
                  className="block text-sm font-medium text-gray-700"
                >
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