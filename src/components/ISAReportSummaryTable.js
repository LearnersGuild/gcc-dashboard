import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class ISAReportSummaryTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      const reportData = this.props.data

    return (
      <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
        <TableRow style={{backgroundColor: '#e7f0f7'}}>
          <TableCell><strong>Cohort</strong></TableCell>
          <TableCell numeric><strong>Exited w/Active ISAs</strong></TableCell>
          <TableCell numeric><strong>In School/Pending ISA Adj</strong></TableCell>
          <TableCell numeric><strong>In Grace</strong></TableCell>
          <TableCell numeric><strong>In Transition</strong></TableCell>
          <TableCell numeric><strong>In Payment</strong></TableCell>
          <TableCell numeric><strong>In Deferment</strong></TableCell>
          <TableCell numeric><strong>Income Docs Received</strong></TableCell>
          <TableCell numeric><strong>Payments Made</strong></TableCell>
          <TableCell numeric><strong>Past Due</strong></TableCell>
          <TableCell numeric><strong>Current on Payments</strong></TableCell>
        </TableRow>
        {reportData.map((item, idx) => {
          return (
            <TableRow key={idx}>
              <TableCell>{item.segment}</TableCell>
              <TableCell numeric>{item.exitedLearners}</TableCell>
              <TableCell numeric>{item.inSchoolOrPending}</TableCell>
              <TableCell numeric>{item.inGrace}</TableCell>
              <TableCell numeric>{item.inTransition}</TableCell>
              <TableCell numeric>{item.inPayment}</TableCell>
              <TableCell numeric>{item.inDeferment}</TableCell>
              <TableCell numeric>{item.incomeDocsReceived}</TableCell>
              <TableCell numeric>{item.haveMadePayments}</TableCell>
              <TableCell numeric>{item.pastDue}</TableCell>
              <TableCell numeric>{item.currentOnPayments}</TableCell>
            </TableRow>
          )
        })}
      </Table>
    )
  }
}

export default ISAReportSummaryTable
