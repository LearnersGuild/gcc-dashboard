import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
      const total = this.props.total[0]
    return (
      <Table selectable={false} style={{ marginTop: 10 }}>
        <TableHead>
          <TableCell>{this.props.title}</TableCell>
          <TableCell numeric>In Job</TableCell>
          <TableCell numeric>In Payment</TableCell>
          <TableCell numeric>In Deferment</TableCell>
          <TableCell numeric>Current On Payments</TableCell>
          <TableCell numeric>No Payments Made</TableCell>
          <TableCell numeric>Past Due but Have Made Payments</TableCell>
          <TableCell numeric>Avg Salary</TableCell>
          <TableCell numeric>Avg Reported Salary</TableCell>
          <TableCell numeric>Avg PIF</TableCell>
          <TableCell numeric>Avg LLF</TableCell>
        </TableHead>
        {reportData.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.segment}</TableCell>
            <TableCell numeric>{item.inJob}</TableCell>
            <TableCell numeric>{item.inPayment}</TableCell>
            <TableCell numeric>{item.inDeferment}</TableCell>
            <TableCell numeric>{item.currentOnPayments}</TableCell>
            <TableCell numeric>{item.noPaymentsMade}</TableCell>
            <TableCell numeric>{item.pastDueButHaveMadePayments}</TableCell>
            <TableCell numeric>${item.avgSalary}</TableCell>
            <TableCell numeric>${item.avgReportedSalary}</TableCell>
            <TableCell numeric>{(item.avgPIFPercent * 100).toFixed(2)}%</TableCell>
            <TableCell numeric>{(item.avgLLFPercent * 100).toFixed(2)}%</TableCell>
          </TableRow>
        ))}
        <TableRow>
            <TableCell><strong>{total.segment}</strong></TableCell>
            <TableCell numeric><strong>{total.inJob}</strong></TableCell>
            <TableCell numeric><strong>{total.inPayment}</strong></TableCell>
            <TableCell numeric><strong>{total.inDeferment}</strong></TableCell>
            <TableCell numeric><strong>{total.currentOnPayments}</strong></TableCell>
            <TableCell numeric><strong>{total.noPaymentsMade}</strong></TableCell>
            <TableCell numeric><strong>{total.pastDueButHaveMadePayments}</strong></TableCell>
            <TableCell numeric><strong>${total.avgSalary}</strong></TableCell>
            <TableCell numeric><strong>${total.avgReportedSalary}</strong></TableCell>
            <TableCell numeric><strong>{(total.avgPIFPercent * 100).toFixed(2)}%</strong></TableCell>
            <TableCell numeric><strong>{(total.avgLLFPercent * 100).toFixed(2)}%</strong></TableCell>
          </TableRow>
      </Table>
    )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default JobsReportTable
