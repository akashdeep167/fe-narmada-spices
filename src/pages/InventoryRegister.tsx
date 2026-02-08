import Header from "../components/common/Header";
import { InventoryTable } from "../components/inventoryTable/InventoryTable";

const InventoryRegister = () => {
  return (
    <>
      <div className="flex flex-col">
        <Header />
        <div className="p-4">
          <InventoryTable />
        </div>
      </div>
    </>
  );
};

export default InventoryRegister;
