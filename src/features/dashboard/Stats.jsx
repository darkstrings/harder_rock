import Stat from "./Stat";
import { HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineChartBar } from "react-icons/hi";
import { formatCurrency } from "../../utils/helpers";
import styled from "styled-components";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  //Number of bookings
  const numBookings = bookings.length;

  //   Total sales
  //   const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0); // 0 is the starting value
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);

  //   confirmedStays stays
  const checkins = confirmedStays.length;

  //occupancy rate
  //   num of checked in nights / all available nights
  const occupation = confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) / (numDays * cabinCount);

  return (
    <>
      <Stat title="Bookings" color="blue" icon={<HiOutlineBriefcase />} value={numBookings} />
      <Stat title="Sales" color="green" icon={<HiOutlineCurrencyDollar />} value={formatCurrency(sales)} />
      <Stat title="Check-ins" color="indigo" icon={<HiOutlineCalendar />} value={checkins} />
      <Stat title="Occupancy Rate" color="Yellow" icon={<HiOutlineChartBar />} value={Math.round(occupation * 100) + "%"} />
    </>
  );
}

export default Stats;
