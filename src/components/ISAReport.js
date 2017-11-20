import React, {Component} from 'react'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import ISAReportDetailTable from './ISAReportDetailTable'


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
          <Card style={{marginTop: '2em'}}>
            <CardTitle title='Exited Learner Details'/>
            <CardText>
              <Tabs index={this.state.index} onChange={this.handleTabChange}>
                <Tab label='Total w/Active ISAs'>
                  <ISAReportDetailTable data={this.state.reportData.exitedWithActiveISA}/>
                </Tab>
                <Tab label='School/Pending ISA Adjustment'>

                </Tab>
                <Tab label='Grace'>

                </Tab>
                <Tab label='Payment'>

                </Tab>
                <Tab label='Deferment'>

                </Tab>
                <Tab label='Income Docs Received'>

                </Tab>
                <Tab label='No Income Docs Received'>

                </Tab>
                <Tab label='Have Made Payments'>

                </Tab>
                <Tab label='Past Due'>

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
