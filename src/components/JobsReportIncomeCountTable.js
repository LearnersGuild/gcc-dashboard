import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportIncomeCountTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
    return (
      <Table selectable={false}>
        <TableHead>
          <TableCell>Income</TableCell>
          <TableCell numeric>Full Time</TableCell>
          <TableCell numeric>Part Time</TableCell>
        </TableHead>
        {reportData.counts.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.segment}</TableCell>
            <TableCell numeric>{item.fullTimeCount} ({((item.fullTimeCount / reportData.total) * 100).toFixed(0)}%)</TableCell>
            <TableCell numeric>{item.partTimeCount} ({((item.partTimeCount / reportData.total) * 100).toFixed(0)}%)</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell><strong>Total In Jobs: {reportData.total}</strong></TableCell>
          <TableCell numeric><strong>{reportData.fullTimeTotal}</strong></TableCell>
          <TableCell numeric><strong>{reportData.partTimeTotal}</strong></TableCell>
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

export default JobsReportIncomeCountTable
