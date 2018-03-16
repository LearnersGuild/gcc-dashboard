import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportPlacementTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
      const total = this.props.total[0]
      const graduated = total.inJobSearch + total.inJobFullTime + total.inJobPartTime
      const employed = total.inJobFullTime + total.inJobPartTime
    return (
      <Table selectable={false} style={{ marginTop: 10 }}>
        <TableHead>
          <TableCell>Exit Date</TableCell>
          <TableCell numeric>Graduated</TableCell>
          <TableCell numeric>Employed In Field</TableCell>
          <TableCell numeric>% Employed In Field</TableCell>
          <TableCell numeric>Full Time In Field</TableCell>
          <TableCell numeric>% Full Time In Field</TableCell>
        </TableHead>
        {reportData.map((item, idx) => {
          const graduated = item.inJobSearch + item.inJobFullTime + item.inJobPartTime
          const employed = item.inJobFullTime + item.inJobPartTime
          return (
            <TableRow key={idx}>
              <TableCell>{item.segment}</TableCell>
              <TableCell numeric>{graduated}</TableCell>
              <TableCell numeric>{employed}</TableCell>
              <TableCell numeric>{((employed / graduated) * 100).toFixed(2)}%</TableCell>
              <TableCell numeric>{item.inJobFullTime}</TableCell>
              <TableCell numeric>{((item.inJobFullTime / graduated) * 100).toFixed(2)}%</TableCell>
            </TableRow>
          )
        })}

        <TableRow>
          <TableCell><strong>{total.segment}</strong></TableCell>
          <TableCell numeric><strong>{graduated}</strong></TableCell>
          <TableCell numeric><strong>{employed}</strong></TableCell>
          <TableCell numeric><strong>{((employed / graduated) * 100).toFixed(2)}%</strong></TableCell>
          <TableCell numeric><strong>{total.inJobFullTime}</strong></TableCell>
          <TableCell numeric><strong>{((total.inJobFullTime / graduated) * 100).toFixed(2)}%</strong></TableCell>
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

export default JobsReportPlacementTable
