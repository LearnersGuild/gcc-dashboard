import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class PerformanceReportAttemptsTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
      const phase = this.props.phase
      
      return (
        <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
          <TableRow style={{backgroundColor: '#e7f0f7'}}>
            <TableCell><strong>Weeks in Current Phase</strong></TableCell>
            <TableCell numeric><strong>Has Not Attempted</strong></TableCell>
            <TableCell numeric><strong>Attempt 1</strong></TableCell>
            <TableCell numeric><strong>Attempt 2</strong></TableCell>
            <TableCell numeric><strong>Attempt 3</strong></TableCell>
            <TableCell numeric><strong>Attempt 4</strong></TableCell>
            <TableCell numeric><strong>Attempt 5</strong></TableCell>
          </TableRow>
          {reportData.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>{item.segment}</TableCell>
                <TableCell numeric>{item[`${phase}HasNotAttempted`]}</TableCell>
                <TableCell numeric>{item[`${phase}Attempt1`]}</TableCell>
                <TableCell numeric>{item[`${phase}Attempt2`]}</TableCell>
                <TableCell numeric>{item[`${phase}Attempt3`]}</TableCell>
                <TableCell numeric>{item[`${phase}Attempt4`]}</TableCell>
                <TableCell numeric>{item[`${phase}Attempt5`]}</TableCell>
              </TableRow>
            )
          })}
        </Table>
      )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default PerformanceReportAttemptsTable
