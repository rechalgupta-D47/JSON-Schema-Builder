import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Row, Col, Card, Tabs, Button, message } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import Builder from './Builder';
import { Field } from './types_simple';
import 'antd/dist/reset.css';

const { TabPane } = Tabs;
const LOCAL_STORAGE_KEY = 'json_schema_data';

const loadSchema = (): { schema: Field[] } => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data && JSON.parse(data).schema?.length > 0) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load or parse schema from localStorage", error);
  }
  // Return a default schema if nothing is found or an error occurs
  return {
    schema: [
      { id: 'field1', key: 'user', type: 'Nested', fields: [
        { id: 'field2', key: 'name', type: 'String', fields: [] },
        { id: 'field3', key: 'age', type: 'Number', fields: [] }
      ]}
    ]
  };
};

const App: React.FC = () => {

  const methods = useForm({
    defaultValues: loadSchema(),
    mode: 'onChange',
  });
  const { watch, reset } = methods;
  const [json, setJson] = useState({});

  // Shorter generateJson
  const genJson = useCallback((schema: Field[]): any => {
    const res: any = {};
    if (!schema) return res;
    schema.forEach(f => {
      if (f && f.key) {
        switch (f.type) {
          case 'String': res[f.key] = 'Sample String'; break;
          case 'Number': res[f.key] = 12345; break;
          case 'Boolean': res[f.key] = true; break;
          case 'Nested': res[f.key] = genJson(f.fields || []); break;
          case 'Array':
            if (f.arrayType === 'Nested') {
              res[f.key] = [genJson(f.fields || [])];
            } else if (f.arrayType === 'String') {
              res[f.key] = ['String 1', 'String 2'];
            } else if (f.arrayType === 'Number') {
              res[f.key] = [1, 2, 3];
            } else if (f.arrayType === 'Boolean') {
              res[f.key] = [true, false];
            }
            break;
        }
      }
    });
    return res;
  }, []);


  useEffect(() => {
    const sub = watch((val) => {
      setJson(genJson(val.schema as Field[]));
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(val));
      } catch (e) {
        console.error("Failed to save schema to localStorage", e);
      }
    });
    setJson(genJson(methods.getValues().schema as Field[]));
    return () => sub.unsubscribe();
  }, [watch, methods, genJson]);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    message.success('JSON copied to clipboard!');
  };

  const clearAll = () => {
    reset({ schema: [] });
    message.info('Schema cleared.');
  };

    return (
    <FormProvider {...methods}>
      <div className="main-bg">
        <header style={{
          width: '100%',
          background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
          padding: '32px 0 24px 0',
          marginBottom: 32,
          boxShadow: '0 2px 12px rgba(58,123,213,0.08)',
          borderRadius: '0 0 24px 24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: 0,
            letterSpacing: '1px',
            textShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>JSON Schema Builder</h1>
          <p style={{ color: '#e0f7fa', fontSize: '1.1rem', marginTop: 12, marginBottom: 0 }}>
            Visually design and preview your JSON schemas in real time
          </p>
        </header>
        <Row gutter={32} justify="center">
          <Col xs={24} md={11} style={{ marginBottom: 32 }}>
            <Card 
              className="schema-card"
              title={<span style={{ fontWeight: 600, fontSize: '1.15rem', color: '#3a7bd5' }}>Schema Editor</span>}
              extra={<Button danger icon={<DeleteOutlined />} onClick={clearAll}>Clear All</Button>}
              bodyStyle={{ padding: 28, minHeight: 480 }}
            >
              <Builder idx="schema" />
            </Card>
          </Col>
          <Col xs={24} md={11} style={{ marginBottom: 32 }}>
            <Card 
              className="json-card"
              title={<span style={{ fontWeight: 600, fontSize: '1.15rem', color: '#00b4d8' }}>Live JSON Output</span>}
              bodyStyle={{ padding: 28, minHeight: 480 }}
            >
              <Tabs 
                defaultActiveKey="1" 
                tabBarExtraContent={<Button icon={<CopyOutlined />} onClick={copyJson}>Copy</Button>}
                tabBarStyle={{ marginBottom: 0 }}
              >
                <TabPane tab="JSON" key="1">
                  <pre className="json-output">
                    {JSON.stringify(json, null, 2)}
                  </pre>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
        <footer style={{
          textAlign: 'center',
          color: '#b0b8c1',
          fontSize: '1rem',
          marginTop: 24,
          marginBottom: 8
        }}>
          &copy; {new Date().getFullYear()} JSON Schema Builder. All rights reserved.
        </footer>
      </div>
    </FormProvider>
  );
};

export default App;