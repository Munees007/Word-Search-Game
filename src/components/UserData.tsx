import React, { useEffect, useState } from "react";
import { getAllUserData, getFlagData, setFlagData } from "./storeData";
import { UserData } from "../types/type";
import { Button, Select, Modal, Watermark, Table, Tag, Space, Typography } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const UserDataComponent: React.FC = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [dates, setDates] = useState<Set<number>>();
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [flag, setFlag] = useState<any>();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const fetchData = async (type: string) => {
    try {
      const userData = await getAllUserData();
      const usersArray = Object.keys(userData).map(key => ({ key, ...userData[key] }));

      const datesSet: Set<number> = new Set();
      usersArray.forEach((data) => {
        if (data.date) datesSet.add(data.date);
      });
      setDates(datesSet);

      if (type === "score") {
  usersArray.sort((a, b) => b.gameData.score - a.gameData.score);
} else if (type === "time") {
  usersArray.sort((a, b) => b.gameData.time - a.gameData.time); // MORE time left = better
} else if (type === "chanceleft") {
  usersArray.sort((a, b) => b.gameData.chanceleft - a.gameData.chanceleft);
} else if (type === "all") {
  usersArray.sort((a, b) => {
    // 1. Higher score is better
    if (b.gameData.score !== a.gameData.score)
      return b.gameData.score - a.gameData.score;

    // 2. Higher chance left is better
    if (b.gameData.chanceleft !== a.gameData.chanceleft)
      return b.gameData.chanceleft - a.gameData.chanceleft;

    // 3. Higher time left is better
    return b.gameData.time - a.gameData.time;
  });
}



      const getFlag = await getFlagData();
      setUserList(usersArray);
      setFlag(getFlag);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSelectChange = (value: string) => {
    fetchData(value);
  };

  const handleTimerStart = async () => {
    await setFlagData(!flag);
    setFlag(!flag);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const showWords = (words: { word: string }[] | undefined) => {
    setSelectedWords(words?.map(w => w.word) || []);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchData("all");
  }, [dataFetched, flag]);

  const columns = [
    {
      title: "Name",
      dataIndex: ["formData", "name"],
      key: "name",
    },
    {
      title: "Roll No",
      dataIndex: ["formData", "rollNumber"],
      key: "rollNumber",
    },
    {
      title: "Class",
      dataIndex: ["formData", "className"],
      key: "className",
    },
    {
      title: "Email",
      dataIndex: ["formData", "email"],
      key: "email",
    },
    {
      title: "Grid Num",
      dataIndex: ["gameData", "gridNum"],
      key: "gridNum",
      render: (val: number) => val + 1
    },
    {
      title: "Score",
      dataIndex: ["gameData", "score"],
      key: "score",
      render: (score: number) => <Tag color="blue">{score}</Tag>
    },
    {
      title: "Chance Left",
      dataIndex: ["gameData", "chanceleft"],
      key: "chanceleft",
      render: (chance: number) => <Tag color="orange">{chance}</Tag>
    },
    {
      title: "Time Left",
      dataIndex: ["gameData", "time"],
      key: "time",
      render: (val: number) => formatTime(val)
    },
    {
      title: "Words Found",
      key: "wordsFound",
      render: (_: any, record: UserData) => (
        <Button onClick={() => showWords(record.gameData.wordsFound)} size="small">View</Button>
      )
    },
  ];

  return (
    <div className="w-full h-screen overflow-auto bg-white p-5">
      <Title level={2} className="text-center" style={{ color: '#006d75' }}>All USER DETAILS</Title>

      <Space className="mb-4" size="large" wrap>
        <Text strong>Time Started: </Text>
        <Tag color={flag ? "green" : "red"}>{flag ? "true" : "false"}</Tag>
        <Button onClick={handleTimerStart} type="primary">{flag ? "Off" : "On"}</Button>

        <Select defaultValue="all" onChange={handleSelectChange} style={{ width: 160 }}>
          <Option value="all">Overall</Option>
          <Option value="score">Score</Option>
          <Option value="time">Time</Option>
          <Option value="chanceleft">Chance Left</Option>
        </Select>

        <Select placeholder="Select Date" onChange={(value) => setSelectedDate(value)}
  allowClear style={{ width: 180 }}>
          {[...(dates ?? [])].map((value, index) => (
            <Option key={index} value={value} >
              {new Date(value).toLocaleDateString()}
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={
    selectedDate
      ? userList.filter(user => user.date === selectedDate)
      : userList
  }
        rowKey={(record) => record.formData.rollNumber}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} title="Words Found">
        <Watermark content="MW" font={{ fontSize: 16 }} gap={[100, 100]}>
          <div className="max-h-60 overflow-auto">
            {selectedWords.length > 0 ? (
              selectedWords.map((word, idx) => (
                <p key={idx}>{idx+1}) {word}</p>
              ))
            ) : (
              <p className="text-gray-400">No Words Found</p>
            )}
          </div>
        </Watermark>
      </Modal>
    </div>
  );
};

export default UserDataComponent;
