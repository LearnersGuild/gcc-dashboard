import React, {Component} from 'react'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import cardStyle from './cardStyle'
import ISAReportDetailTable from './ISAReportDetailTable'
import ISAReportSummaryTable from './ISAReportSummaryTable'


class ISAReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportData: '',
      index: 0
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentDidMount() {
    axios.get('/api/reports/createisareport')
      .then(response => {
        this.setState({reportData: response.data})
      }).catch(err => {
        console.log(err.message)
      })
  }

  handleTabChange(index) {
    this.setState({index})
  }

  render() {
    if (this.state.reportData) {
      return (
        <div>
          <Card style={cardStyle()}>
            <CardTitle title='ISA Payment Rate'/>
            <CardText>
              Have Paid/In Payment: <strong>{((this.state.reportData.summary[0].haveMadePayments / this.state.reportData.summary[0].inPayment)* 100).toFixed(2)}%</strong>
            </CardText>
          </Card>
          <Card style={{marginTop: '2em'}}>
            <CardTitle title='Exited Learner Summary'/>
            <CardText>
              <ISAReportSummaryTable data={this.state.reportData.summary}/>
            </CardText>
          </Card>
          <Card style={{marginTop: '2em'}}>
            <CardTitle title='Exited Learner Details'/>
            <CardText>
              <Tabs index={this.state.index} onChange={this.handleTabChange}>
                <Tab label='Total w/Active ISAs'>
                  <ISAReportDetailTable data={this.state.reportData.exitedWithActiveISA}/>
                </Tab>
                <Tab label='School/Pending ISA Adjustment'>
                  <ISAReportDetailTable data={this.state.reportData.schoolAndPending}/>
                </Tab>
                <Tab label='Grace'>
                  <ISAReportDetailTable data={this.state.reportData.grace}/>
                </Tab>
                <Tab label='Payment'>
                  <ISAReportDetailTable data={this.state.reportData.payment}/>
                </Tab>
                <Tab label='Deferment'>
                  <ISAReportDetailTable data={this.state.reportData.deferment}/>
                </Tab>
                <Tab label='Income Docs Received'>
                  <ISAReportDetailTable data={this.state.reportData.incomeDocsReceived}/>
                </Tab>
                <Tab label='No Income Docs Received'>
                  <ISAReportDetailTable data={this.state.reportData.noIncomeDocsReceived}/>
                </Tab>
                <Tab label='Payments Made'>
                  <ISAReportDetailTable data={this.state.reportData.haveMadePayments}/>
                </Tab>
                <Tab label='Past Due'>
                  <ISAReportDetailTable data={this.state.reportData.pastDue}/>
                </Tab>
              </Tabs>
            </CardText>
          </Card>
        </div>
      )
    } else {
      return (
        <div>Getting Report Data</div>
      )
    }
  }
}

export default ISAReport
