import React, {Component} from 'react'
import Table from 'react-toolbox/lib/table/Table'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'

class PerformanceReportPhaseDataTable extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.data) {
      const phaseData = this.props.data
      if (this.props.type === 'avg') {
        return (
          <Table selectable={false}>
            <TableRow style={{backgroundColor: '#e7f0f7'}}>
              <TableCell numeric><strong>Phase 1</strong></TableCell>
              <TableCell numeric><strong>Phase 2</strong></TableCell>
              <TableCell numeric><strong>Phase 3</strong></TableCell>
              <TableCell numeric><strong>Phase 45</strong></TableCell>
            </TableRow>
              <TableRow>
                <TableCell numeric>{phaseData.phase1}</TableCell>
                <TableCell numeric>{phaseData.phase2}</TableCell>
                <TableCell numeric>{phaseData.phase3}</TableCell>
                <TableCell numeric>{(parseFloat(phaseData.phase4) + parseFloat(phaseData.phase5))/2}</TableCell>
              </TableRow>
            ))}
          </Table>
        )
      } else {
        return (
          <Table selectable={false}>
            <TableRow style={{backgroundColor: '#e7f0f7'}}>
              <TableCell numeric><strong>Total</strong></TableCell>
              <TableCell numeric><strong>Phase 1</strong></TableCell>
              <TableCell numeric><strong>Phase 2</strong></TableCell>
              <TableCell numeric><strong>Phase 3</strong></TableCell>
              <TableCell numeric><strong>Phase 45</strong></TableCell>
            </TableRow>
              <TableRow>
                <TableCell numeric>{phaseData.phase1 + phaseData.phase2 + phaseData.phase3 + phaseData.phase4 + phaseData.phase5}</TableCell>
                <TableCell numeric>{phaseData.phase1}</TableCell>
                <TableCell numeric>{phaseData.phase2}</TableCell>
                <TableCell numeric>{phaseData.phase3}</TableCell>
                <TableCell numeric>{phaseData.phase4 + phaseData.phase5}</TableCell>
              </TableRow>
            ))}
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

export default PerformanceReportPhaseDataTable
