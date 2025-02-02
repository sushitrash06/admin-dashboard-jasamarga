import { filterByDateAndGroupByGate } from '../../utils/filtered';
import { RowData } from '../../utils/types';
import GateChart from '../molecules/gate-chart';

interface PaymentMethodI {
    data: RowData[]
}
const GateDataComponent: React.FC<PaymentMethodI> = ({data}) => {
const DataGate = filterByDateAndGroupByGate(data);
  return (
    <div>
      <GateChart data={DataGate ?? []} />
    </div>
  );
};

export default GateDataComponent
