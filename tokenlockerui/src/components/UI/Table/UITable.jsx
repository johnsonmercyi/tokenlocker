import React from 'react';
import { Table } from 'semantic-ui-react';
import UITableRow from './UITableRow';

const UITable = ({ headers = [], data = [], ...props }) => {
  const { Header, Body, HeaderCell, Row, Cell } = Table;
  return (
    <Table>
      <Header>
        <Row>
          {
            headers.map(
              (header, index) => <HeaderCell key={index}>{header}</HeaderCell>
            )
          }
        </Row>
      </Header>

      <Body>
        {
          data.map((data, index) => (
            <UITableRow 
              key={index}
              data={data}
              id={index}
              {...props}/>
          ))
        }
      </Body>
    </Table>
  );
}

export default UITable;