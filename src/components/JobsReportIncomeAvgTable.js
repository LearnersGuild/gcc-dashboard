import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportIncomeAvgTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
    return (
      <Table selectable={false}>
        <TableHead>
          <TableCell> </TableCell>
          <TableCell numeric>Full Time</TableCell>
          <TableCell numeric>Part Time</TableCell>
        </TableHead>
        {reportData.averages.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.segment}</TableCell>
            <TableCell numeric>${item.fullTimeValue}</TableCell>
            <TableCell numeric>${item.partTimeValue}</TableCell>
          </TableRow>
        ))}
      </Table>
    )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default JobsReportIncomeAvgTable
