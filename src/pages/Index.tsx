import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import html2canvas from "html2canvas";

interface DocumentItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentDoc, setCurrentDoc] = useState<"check" | "report">("check");
  const [companyName, setCompanyName] = useState('ООО "СтройПроект"');
  const [documentNumber, setDocumentNumber] = useState("001");
  const [documentDate, setDocumentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState<DocumentItem[]>([
    {
      id: "1",
      name: "Цемент М400",
      quantity: 10,
      unit: "т",
      price: 5000,
      total: 50000,
    },
  ]);
  const [reportText, setReportText] = useState("");
  const documentRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const addItem = () => {
    const newItem: DocumentItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "шт",
      price: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof DocumentItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "price") {
            updated.total = updated.quantity * updated.price;
          }
          return updated;
        }
        return item;
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getTotalSum = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const exportToJPG = async () => {
    if (documentRef.current) {
      const canvas = await html2canvas(documentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${currentDoc}-${documentNumber}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-none border-2 border-[#2C2C2C]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono text-[#2C2C2C] mb-2">
              ДОКУМЕНТООБОРОТ
            </CardTitle>
            <p className="text-sm text-[#2C2C2C] font-mono">
              Система управления документами
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-mono text-[#2C2C2C]"
              >
                Логин
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-[#2C2C2C] rounded-none font-mono"
                placeholder="Введите логин"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-mono text-[#2C2C2C]"
              >
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-[#2C2C2C] rounded-none font-mono"
                placeholder="Введите пароль"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-[#2C2C2C] hover:bg-[#1A1A1A] text-white rounded-none font-mono"
            >
              ВОЙТИ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-2 border-[#2C2C2C] mb-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-mono text-[#2C2C2C]">
              ДОКУМЕНТООБОРОТ
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-mono text-[#2C2C2C]">
                Пользователь: {username}
              </span>
              <Button
                onClick={() => setIsLoggedIn(false)}
                variant="outline"
                className="border-2 border-[#2C2C2C] rounded-none font-mono"
              >
                ВЫХОД
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-2 border-[#2C2C2C] shadow-none">
              <CardHeader>
                <CardTitle className="font-mono text-[#2C2C2C]">
                  ПАНЕЛЬ УПРАВЛЕНИЯ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-mono text-[#2C2C2C]">
                    Тип документа
                  </Label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setCurrentDoc("check")}
                      variant={currentDoc === "check" ? "default" : "outline"}
                      className={`flex-1 rounded-none font-mono ${
                        currentDoc === "check"
                          ? "bg-[#2C2C2C] text-white"
                          : "border-2 border-[#2C2C2C] text-[#2C2C2C]"
                      }`}
                    >
                      ЧЕК
                    </Button>
                    <Button
                      onClick={() => setCurrentDoc("report")}
                      variant={currentDoc === "report" ? "default" : "outline"}
                      className={`flex-1 rounded-none font-mono ${
                        currentDoc === "report"
                          ? "bg-[#2C2C2C] text-white"
                          : "border-2 border-[#2C2C2C] text-[#2C2C2C]"
                      }`}
                    >
                      ОТЧЁТ
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-mono text-[#2C2C2C]">
                    Компания
                  </Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border-2 border-[#2C2C2C] rounded-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-mono text-[#2C2C2C]">
                    Номер документа
                  </Label>
                  <Input
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="border-2 border-[#2C2C2C] rounded-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-mono text-[#2C2C2C]">
                    Дата
                  </Label>
                  <Input
                    type="date"
                    value={documentDate}
                    onChange={(e) => setDocumentDate(e.target.value)}
                    className="border-2 border-[#2C2C2C] rounded-none font-mono"
                  />
                </div>

                {currentDoc === "check" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-mono text-[#2C2C2C]">
                      Клиент
                    </Label>
                    <Input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="border-2 border-[#2C2C2C] rounded-none font-mono"
                      placeholder="Название организации"
                    />
                  </div>
                )}

                <Separator className="bg-[#2C2C2C]" />

                {currentDoc === "check" && (
                  <Button
                    onClick={addItem}
                    className="w-full bg-[#2C2C2C] hover:bg-[#1A1A1A] text-white rounded-none font-mono"
                  >
                    + ДОБАВИТЬ ПОЗИЦИЮ
                  </Button>
                )}

                <Button
                  onClick={exportToJPG}
                  className="w-full bg-[#007ACC] hover:bg-[#005A99] text-white rounded-none font-mono"
                >
                  <Icon name="Download" className="mr-2" />
                  ЭКСПОРТ В JPG
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Document Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-2 border-[#2C2C2C] shadow-none">
              <CardHeader>
                <CardTitle className="font-mono text-[#2C2C2C]">
                  РЕДАКТОР ДОКУМЕНТОВ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={documentRef}
                  className="bg-white p-8 border border-[#2C2C2C] font-mono text-[#2C2C2C]"
                  style={{ minHeight: "600px" }}
                >
                  {/* Document Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-2">{companyName}</h2>
                    <h3 className="text-lg mb-2">
                      {currentDoc === "check" ? "ЧЕК" : "ОТЧЁТ"} №{" "}
                      {documentNumber}
                    </h3>
                    <p className="text-sm">от {documentDate}</p>
                    {currentDoc === "check" && clientName && (
                      <p className="text-sm mt-2">Клиент: {clientName}</p>
                    )}
                  </div>

                  {currentDoc === "check" ? (
                    <div>
                      {/* Items Table */}
                      <div className="mb-6">
                        <div className="border-2 border-[#2C2C2C]">
                          <div className="bg-[#F5F5F5] p-2 border-b-2 border-[#2C2C2C] grid grid-cols-6 gap-2 text-sm font-bold">
                            <div>НАИМЕНОВАНИЕ</div>
                            <div>КОЛ-ВО</div>
                            <div>ЕД.ИЗМ</div>
                            <div>ЦЕНА</div>
                            <div>СУММА</div>
                            <div>ДЕЙСТВИЯ</div>
                          </div>
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 border-b border-[#2C2C2C] grid grid-cols-6 gap-2 text-sm"
                            >
                              <Input
                                value={item.name}
                                onChange={(e) =>
                                  updateItem(item.id, "name", e.target.value)
                                }
                                className="border border-[#2C2C2C] rounded-none text-xs h-8 font-mono"
                                placeholder="Название"
                              />
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "quantity",
                                    Number(e.target.value),
                                  )
                                }
                                className="border border-[#2C2C2C] rounded-none text-xs h-8 font-mono"
                              />
                              <Input
                                value={item.unit}
                                onChange={(e) =>
                                  updateItem(item.id, "unit", e.target.value)
                                }
                                className="border border-[#2C2C2C] rounded-none text-xs h-8 font-mono"
                              />
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "price",
                                    Number(e.target.value),
                                  )
                                }
                                className="border border-[#2C2C2C] rounded-none text-xs h-8 font-mono"
                              />
                              <div className="flex items-center font-bold">
                                {item.total.toLocaleString("ru-RU")} ₽
                              </div>
                              <Button
                                onClick={() => removeItem(item.id)}
                                variant="destructive"
                                size="sm"
                                className="h-8 rounded-none text-xs"
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <div className="text-xl font-bold border-t-2 border-[#2C2C2C] pt-2">
                          ИТОГО: {getTotalSum().toLocaleString("ru-RU")} ₽
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Textarea
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        placeholder="Введите текст отчёта..."
                        className="min-h-[400px] border-2 border-[#2C2C2C] rounded-none font-mono resize-none"
                      />
                      <div className="text-sm text-gray-500">
                        Используйте это поле для составления отчётов о
                        выполненных работах, расходе материалов и других данных.
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
