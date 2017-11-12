import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableHead from 'react-toolbox/lib/table/TableHead'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class PerformanceReportPhaseAdvancementTable extends Component {
  constructor(props) {
    super(props)
  }

  blankRow(item, idx) {
    return (
      <TableRow key={idx}>
        <TableCell>{item.segment}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
      </TableRow>
    )
  }

  phase45BlankRow(item, idx) {
    return (
      <TableRow key={idx}>
        <TableCell>{item.segment}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
        <TableCell numeric>{`''`}</TableCell>
      </TableRow>
    )
  }

  render() {
    if (this.props.data) {
      const reportData = this.props.data
      const phase = this.props.phase
      if (phase === 'total') {
        return (
          <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
            <TableRow style={{backgroundColor: '#e7f0f7'}}>
              <TableCell><strong>{this.props.title}</strong></TableCell>
              <TableCell numeric><strong>Adv in Less Than 6 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv In 6 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv In 7 or 8 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv More Than 8 Weeks</strong></TableCell>
              <TableCell numeric><strong>Has Not Advanced</strong></TableCell>
              <TableCell numeric><strong>Graduated Early</strong></TableCell>
              <TableCell numeric><strong>Avg Weeks to Advance</strong></TableCell>
              <TableCell numeric><strong>Adv In 1 Try</strong></TableCell>
              <TableCell numeric><strong>Adv In More Than 1 Try</strong></TableCell>
              <TableCell numeric><strong>Avg Tries</strong></TableCell>
            </TableRow>
            {reportData.map((item, idx) => {
              if (item.segment === '') {
                return this.blankRow(item, idx)
              } else {
                return (
                  <TableRow key={idx}>
                    <TableCell>{item.segment}</TableCell>
                    <TableCell numeric>{item[`${phase}LessThan6`]}</TableCell>
                    <TableCell numeric>{item[`${phase}In6`]}</TableCell>
                    <TableCell numeric>{item[`${phase}In7Or8`]}</TableCell>
                    <TableCell numeric>{item[`${phase}MoreThan8`]}</TableCell>
                    <TableCell numeric>{item[`${phase}HasNotAdvanced`]}</TableCell>
                    <TableCell numeric>{item[`${phase}GraduatedEarly`]}</TableCell>
                    <TableCell numeric>
                      {Number.isNaN(Math.round(item[`${phase}AdvancedWeeks`] / item[`${phase}Advanced`])) ?
                          'N/A' : Math.round(item[`${phase}AdvancedWeeks`] / item[`${phase}Advanced`])}
                    </TableCell>
                    <TableCell numeric>{item[`${phase}In1Try`]}</TableCell>
                    <TableCell numeric>{item[`${phase}MoreThan1Try`]}</TableCell>
                    <TableCell numeric>
                      {Number.isNaN((item[`${phase}AdvancedTries`] / (item[`${phase}AssessmentAdvanced`] - item.phase4Advanced - item.phase5Advanced))) ?
                        'N/A' : (item[`${phase}AdvancedTries`] / item.totalAssessmentAdvanced).toFixed(1)}
                    </TableCell>
                  </TableRow>
                )
              }
            })}
          </Table>
        )    
      } else if (phase !== 'phase4' && phase !== 'phase5') {
        return (
          <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
            <TableRow style={{backgroundColor: '#e7f0f7'}}>
              <TableCell><strong>{this.props.title}</strong></TableCell>
              <TableCell numeric><strong>Adv in Less Than 6 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv In 6 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv In 7 or 8 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv More Than 8 Weeks</strong></TableCell>
              <TableCell numeric><strong>Has Not Advanced</strong></TableCell>
              <TableCell numeric><strong>Graduated Early</strong></TableCell>
              <TableCell numeric><strong>Avg Weeks to Advance</strong></TableCell>
              <TableCell numeric><strong>Adv In 1 Try</strong></TableCell>
              <TableCell numeric><strong>Adv In More Than 1 Try</strong></TableCell>
              <TableCell numeric><strong>Avg Tries</strong></TableCell>
            </TableRow>
            {reportData.map((item, idx) => {
              if (item.segment === '') {
                return this.blankRow(item, idx)
              } else {
                return (
                  <TableRow key={idx}>
                    <TableCell>{item.segment}</TableCell>
                    <TableCell numeric>{item[`${phase}LessThan6`]}</TableCell>
                    <TableCell numeric>{item[`${phase}In6`]}</TableCell>
                    <TableCell numeric>{item[`${phase}In7Or8`]}</TableCell>
                    <TableCell numeric>{item[`${phase}MoreThan8`]}</TableCell>
                    <TableCell numeric>{item[`${phase}HasNotAdvanced`]}</TableCell>
                    <TableCell numeric>{item[`${phase}GraduatedEarly`]}</TableCell>
                    <TableCell numeric>
                      {Number.isNaN(Math.round(item[`${phase}AdvancedWeeks`] / item[`${phase}Advanced`])) ?
                          'N/A' : Math.round(item[`${phase}AdvancedWeeks`] / item[`${phase}Advanced`])}
                    </TableCell>
                    <TableCell numeric>{item[`${phase}In1Try`]}</TableCell>
                    <TableCell numeric>{item[`${phase}MoreThan1Try`]}</TableCell>
                    <TableCell numeric>
                      {Number.isNaN(item[`${phase}AdvancedTries`] / item[`${phase}Advanced`]) ?
                        'N/A' : (item[`${phase}AdvancedTries`] / item[`${phase}AssessmentAdvanced`]).toFixed(1)}
                    </TableCell>
                  </TableRow>
                )
              }
            })}
          </Table>
        )
      } else {
        return (
          <Table selectable={false} style={{ marginTop: '1em', tableLayout: 'fixed', width: '100%' }}>
            <TableRow style={{backgroundColor: '#e7f0f7'}}>
              <TableCell><strong>{this.props.title}</strong></TableCell>
              <TableCell numeric><strong>Adv in Less Than 6 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv In 6 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv In 7 or 8 Weeks</strong></TableCell>
              <TableCell numeric><strong>Adv More Than 8 Weeks</strong></TableCell>
              <TableCell numeric><strong>Has Not Advanced</strong></TableCell>
              <TableCell numeric><strong>Graduated Early</strong></TableCell>
              <TableCell numeric><strong>Avg Weeks to Advance</strong></TableCell>
            </TableRow>
            {reportData.map((item, idx) => {
              if (item.segment === '') {
                return this.phase45BlankRow(item, idx)
              } else {
                return (
                <TableRow key={idx}>
                  <TableCell>{item.segment}</TableCell>
                  <TableCell numeric>{item[`${phase}LessThan6`]}</TableCell>
                  <TableCell numeric>{item[`${phase}In6`]}</TableCell>
                  <TableCell numeric>{item[`${phase}In7Or8`]}</TableCell>
                  <TableCell numeric>{item[`${phase}MoreThan8`]}</TableCell>
                  <TableCell numeric>{item[`${phase}HasNotAdvanced`]}</TableCell>
                  <TableCell numeric>{item[`${phase}GraduatedEarly`]}</TableCell>
                  <TableCell numeric>
                    {Number.isNaN(Math.round(item[`${phase}AdvancedWeeks`] / item[`${phase}Advanced`])) ?
                      'N/A' : Math.round(item[`${phase}AdvancedWeeks`] / item[`${phase}Advanced`])}
                  </TableCell>
                </TableRow>
              )}
            })}
          </Table>
        )   
      }
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default PerformanceReportPhaseAdvancementTable
