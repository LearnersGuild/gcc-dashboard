import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class JobsReportIncomeComparisonTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const incomeComparison = this.props.data[this.props.type]
    return (
      <Table selectable={false}>
        <TableHead>
          <TableCell>Income Level</TableCell>
          <TableCell numeric>Pre-Guild Income</TableCell>
          <TableCell numeric>Post-Guild Income</TableCell>
        </TableHead>
        {incomeComparison.segments.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.segment}</TableCell>
            <TableCell numeric>{item.preGuild} ({((item.preGuild / incomeComparison.preGuildTotal) * 100).toFixed(0)}%)</TableCell>
            <TableCell numeric>{item.postGuild} ({((item.postGuild / incomeComparison.postGuildTotal) * 100).toFixed(0)}%)</TableCell>
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

export default JobsReportIncomeComparisonTable
