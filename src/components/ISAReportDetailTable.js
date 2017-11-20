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
          <TableCell numeric><strong>Starting Salary</strong></TableCell>
          <TableCell numeric><strong>PIF %</strong></TableCell>
          <TableCell numeric><strong>LLF %</strong></TableCell>
          <TableCell><strong>Payment Status</strong></TableCell>
          <TableCell><strong>Deferment Type</strong></TableCell>
          <TableCell><strong>Income Docs Received</strong></TableCell>
          <TableCell numeric><strong>Monthly Payment Amount</strong></TableCell>
          <TableCell numeric><strong>Total # Payments Made</strong></TableCell>
        </TableRow>
        {reportData.map((item, idx) => {
          return (
            <TableRow key={idx}>
              <TableCell>{item.firstname} {item.lastname}</TableCell>
              <TableCell numeric>{moment(item.enrollee_start_date).format('YYYY-MM-DD')}</TableCell>
              <TableCell numeric>{moment(item.resignation_date).format('YYYY-MM-DD')}</TableCell>
              <TableCell numeric>${parseInt(item.learner_s_starting_salary, 10)}</TableCell>
              <TableCell numeric>{parseFloat(item.pif_income_percent * 100).toFixed(1)}%</TableCell>
              <TableCell numeric>{parseFloat(item.llf_income_percent * 100).toFixed(1)}%</TableCell>
              <TableCell> </TableCell>
              <TableCell>{item.isa_deferment_type}</TableCell>
              <TableCell>{item.isa_income_docs_received}</TableCell>
              <TableCell numeric> </TableCell>
              <TableCell numeric> </TableCell>
            </TableRow>
          )
        })}
      </Table>
    )
  }
}

export default ISAReportDetailTable
