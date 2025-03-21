import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import { useSearchParams } from "react-router-dom";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;
  if (!cabins.length) return <Empty resourceName="cabins" />;

  // FILTER
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;
  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount") filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount") filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // SORT
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins.toSorted((a, b) =>
    typeof a[field] === "string" ? a[field].localeCompare(b[field]) * modifier : (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header role="row">
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
        </Table.Header>
        {/* To use the render prop pattern, replace this */}
        {/* {cabins.map((cabin) => (
        <CabinRow cabin={cabin} key={cabin.id} />
        ))} */}
        {/* With this */}
        <Table.Body
          // data={cabins}
          // (Before filtering and sorting)

          // data={filteredCabins}
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
        {/* And then receive it in Table.jsk in the Body component ({data, render}) where you see the data is mapped over */}
      </Table>
    </Menus>
  );
}

export default CabinTable;
