import React, {Component} from 'react'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Table from 'react-toolbox/lib/table/Table'
import TableCell from 'react-toolbox/lib/table/TableCell'
import TableRow from 'react-toolbox/lib/table/TableRow'
import cardStyle from './cardStyle'
import LearnersInBuildingReportTable from './LearnersInBuildingReportTable'


class LearnersInBuildingReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportData: ''
    }
  }

  componentDidMount() {
    axios.get('/api/reports/create-learners-in-building-report')
      .then(response => {
        this.setState({reportData: response.data})
      }).catch(err => {
        console.log(err.message)
      })
  }

  render() {
    if (this.state.reportData) {
      let reportData = this.state.reportData
      return (
        <div>
          <div>
            <Card style={cardStyle()}>
              <CardText>
                <h2>Total Learners In Building: {reportData.total}</h2>
              </CardText>
            </Card>
          </div>
          <div>
            <Card style={cardStyle()}>
            <CardTitle title="By Gender"/>
              <CardText>
                <LearnersInBuildingReportTable data={reportData.byGender} />
              </CardText>
            </Card>
            <Card style={cardStyle()}>
            <CardTitle title="By Race"/>
              <CardText>
                <LearnersInBuildingReportTable data={reportData.byRace} />
              </CardText>
            </Card>
          </div>
        </div>
      )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default LearnersInBuildingReport
