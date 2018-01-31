import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'
import moment from 'moment'

class ISAReportDetailTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      const reportData = this.props.data
  
    return (
      <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
        <TableRow style={{backgroundColor: '#e7f0f7'}}>
          <TableCell><strong>Name</strong></TableCell>
          <TableCell numeric><strong>Start Date</strong></TableCell>
          <TableCell numeric><strong>Exit Date</strong></TableCell>
          <TableCell numeric><strong>First Payment Due Date</strong></TableCell>
          <TableCell numeric><strong>Starting Salary (* = Reported)</strong></TableCell>
          <TableCell><strong>Payment Status</strong></TableCell>
          <TableCell><strong>Income Docs Received</strong></TableCell>
          <TableCell numeric><strong>Monthly Payment Amount</strong></TableCell>
          <TableCell numeric><strong>Total # Payments Made</strong></TableCell>
          <TableCell numeric><strong>PIF %</strong></TableCell>
          <TableCell numeric><strong>LLF %</strong></TableCell>
        </TableRow>
        {reportData.map((item, idx) => {
          return (
            <TableRow key={idx}>
              <TableCell>{item.firstname} {item.lastname}</TableCell>
              <TableCell numeric>{item.enrollee_start_date}</TableCell>
              <TableCell numeric>{item.resignation_date}</TableCell>
              <TableCell numeric>{moment(item.first_payment_due_date).format('YYYY-MM-DD')}</TableCell>
              <TableCell numeric>${item.learner_s_starting_salary}</TableCell>
              <TableCell>{item.payment_value}</TableCell>
              <TableCell>{item.isa_income_docs_received}</TableCell>
              <TableCell numeric>${(parseFloat(item.llf_monthly_payment_amount) + parseFloat(item.pif_monthly_payment_amount)).toFixed(2)}</TableCell>
              <TableCell numeric>{parseInt(item.total_payment_count, 10)}</TableCell>
              <TableCell numeric>{item.pif_income_percent}%</TableCell>
              <TableCell numeric>{item.llf_income_percent}%</TableCell>
            </TableRow>
          )
        })}
      </Table>
    )
  }
}

export default ISAReportDetailTable
