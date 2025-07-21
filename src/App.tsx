import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, Tabs, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Structure from './Structure';
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

  const genJson = useCallback((schema: Field[]): any => {
    const res: any = {};
    if (!schema) return res;
    schema.forEach(f => {
      if (f && f.key) {
        switch (f.type) {
          case 'String': res[f.key] = 'Sample String'; break;
          case 'Number': res[f.key] = 12345; break;
          case 'Nested': res[f.key] = genJson(f.fields || []); break;
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



  const clearAll = () => {
    reset({ schema: [] });
  };



  return (
    <FormProvider {...methods}>
      <div className="main-bg" style={{ minHeight: '100vh', height: '100vh', display: 'flex', flexDirection: 'column', padding: 0, background: '#a4d0e2ff' }}>
        <header style={{
          width: '100%',
          background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
          padding: '18px 0 12px 0',
          marginBottom: 18,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
          borderRadius: '0 0 20px 20px',
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
        <div style={{
          display: 'flex',
          gap: 32,
          justifyContent: 'center',
          alignItems: 'stretch',
          transition: 'all 0.3s',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 16px',
          flex: 1,
          minHeight: 0,
        }}>
          <div style={{ width: 540, minWidth: 360, maxWidth: 800, display: 'flex', flexDirection: 'column' }}>
            <Card 
              className="schema-card"
              title={<span style={{ fontWeight: 600, fontSize: '1.13rem', color: '#3a7bd5', letterSpacing: 0.5 }}>Schema Editor</span>}
              extra={<Button danger icon={<DeleteOutlined />} onClick={clearAll} style={{ fontWeight: 500, padding: '0 14px' }}>Delete</Button>}
              bodyStyle={{ padding: 22, minHeight: 0, height: '100%' }}
              style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(58,123,213,0.06)', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <Structure path="schema" />
              </div>
            </Card>
          </div>
          <div style={{ width: 540, minWidth: 360, maxWidth: 800, transition: 'width 0.3s, min-width 0.3s', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card 
              className="json-card"
              title={<span style={{ fontWeight: 600, fontSize: '1.13rem', color: '#00b4d8', letterSpacing: 0.5 }}>Live JSON Output</span>}
              bodyStyle={{ padding: 0, minHeight: 0, height: '100%' }}
              style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,180,216,0.06)', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 22 }}>
                <Tabs 
                  defaultActiveKey="1" 
                  tabBarStyle={{ marginBottom: 0 }}
                >
                  <TabPane tab="JSON" key="1">
                    <pre className="json-output" style={{ fontSize: 15, padding: 12, borderRadius: 8, background: '#f8fafc', margin: 0 }}>
                      {JSON.stringify(json, null, 2)}
                    </pre>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
        <footer style={{
          textAlign: 'center',
          color: '#1f2326ff',
          fontSize: '1.02rem',
          marginTop: 18,
          marginBottom: 8,
          letterSpacing: 0.2,
        }}>
          &copy; {new Date().getFullYear()} JSON Schema Builder. All rights reserved.
        </footer>
      </div>
    </FormProvider>
  );
};

export default App;