import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportPlacementRateTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data[0]
    return (
      <Table selectable={false}>
        <TableRow>
          <TableCell>In Job Search</TableCell>
          <TableCell numeric>{reportData.inJobSearch}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>In Full Time Jobs</TableCell>
          <TableCell numeric>{reportData.inJobFullTime}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>In Part Time Jobs</TableCell>
          <TableCell numeric>{reportData.inJobPartTime}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total In Jobs</TableCell>
          <TableCell numeric>{reportData.inJobFullTime + reportData.inJobPartTime}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Graduated</TableCell>
          <TableCell numeric>{reportData.inJobFullTime + reportData.inJobPartTime + reportData.inJobSearch}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Full-Time Placement %</strong></TableCell>
          <TableCell numeric><strong>{(reportData.inJobFullTime  / (reportData.inJobFullTime + reportData.inJobPartTime + reportData.inJobSearch) * 100).toFixed(1)}%</strong></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Total Placement %</strong></TableCell>
          <TableCell numeric><strong>{((reportData.inJobFullTime + reportData.inJobPartTime)  / (reportData.inJobFullTime + reportData.inJobPartTime + reportData.inJobSearch) * 100).toFixed(1)}%</strong></TableCell>
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

export default JobsReportPlacementRateTable
