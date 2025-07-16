import {
  Card,
  CardContent,
  Divider,
  Typography,
  List,
  ListItemText,
} from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import type { ClassData, Visibility } from '../../types/uml';

// 可視性を記号に変換するヘルパー関数
const getVisibilitySymbol = (visibility?: Visibility): string => {
  switch (visibility) {
    case 'PUBLIC':
      return '+';
    case 'PRIVATE':
      return '-';
    case 'PROTECTED':
      return '#';
    default:
      return '~';
  }
};

// 引数リストを文字列に変換するヘルパー関数
const formatParameters = (parameters: any[]): string => {
  if (!parameters || parameters.length === 0) {
    return '';
  }
  return parameters.map(param => `${param.name}: ${param.type}`).join(', ');
};

// ノードの型定義 (props.dataでClassDataを受け取る)
interface ClassNodeProps {
  data: ClassData;
}

export const ClassNode = ({ data: { classData: data } }: { data: { classData: ClassData } }) => {
  return (
    <>
      {/* 接続ハンドル (上下左右に設定可能) */}
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />

      <Card variant="outlined" sx={{ backgroundColor: 'white' }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            {data.name}
          </Typography>
          <Divider />
          {/* 属性リスト */}
          <List dense>
            {data.attributes.map((attr) => (
              <ListItemText
                key={attr.name}
                primary={`${getVisibilitySymbol(attr.visibility)} ${attr.name}: ${attr.type}`}
                sx={{
                  '& .MuiListItemText-primary': {
                    textDecoration: attr.is_static ? 'underline' : 'none',
                  }
                }}
              />
            ))}
          </List>
          <Divider />
          {/* メソッドリスト */}
          <List dense>
            {data.methods.map((method) => (
              <ListItemText
                key={method.name}
                primary={`${getVisibilitySymbol(method.visibility)} ${method.name}(${formatParameters(method.parameters)}): ${method.return_type}`}
                sx={{
                  '& .MuiListItemText-primary': {
                    textDecoration: method.is_static ? 'underline' : 'none',
                    fontStyle: method.is_abstract ? 'italic' : 'normal',
                  }
                }}
              />
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
};