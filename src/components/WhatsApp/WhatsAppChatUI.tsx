"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Smile, Paperclip, Mic, MoreVertical, Search, Send, X, ChevronLeft, Edit, Check, ChevronRight, Camera, LogOut } from "lucide-react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

// Mock data

interface Emoji {
  native: string; // or whatever properties you need
}

const contacts = [
  { id: 1, name: "Ankit", avatar: "https://avatars.githubusercontent.com/u/122344948?v=4", lastMessage: "Hey, how are you?", status: "Available", phone: "+1234567890" },
  { id: 2, name: "Bob", avatar: "/placeholder-user.jpg", lastMessage: "Can we meet tomorrow?", status: "At work", phone: "+1987654321" },
  { id: 3, name: "Charlie", avatar: "/placeholder-user.jpg", lastMessage: "Thanks for the help!", status: "Busy", phone: "+1122334455" },
]

const initialMessages = [
  { id: 1, sender: "Alice", content: "Hey, how are you?", timestamp: "10:00 AM" },
  { id: 2, sender: "You", content: "I'm good, thanks! How about you?", timestamp: "10:02 AM" },
  { id: 3, sender: "Alice", content: "Doing well, thanks for asking!", timestamp: "10:05 AM" },
]

const WhatsAppChatUI = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messageInput, setMessageInput] = useState("")
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [chatSearchQuery, setChatSearchQuery] = useState("")
  const [showProfileSidebar, setShowProfileSidebar] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [showChatArea, setShowChatArea] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null)
  const [editMessageContent, setEditMessageContent] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [currentUser, setCurrentUser] = useState({
    name: "LiveWithCodeAnkit",
    avatar: "https://avatars.githubusercontent.com/u/144792548?v=4",
    status: "Available"
  })
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "You",
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setChatMessages([...chatMessages, newMessage])
      setMessageInput("")
    }
  }

  const handleDeleteMessage = (id: number) => {
    setChatMessages(chatMessages.filter(message => message.id !== id))
  }

  const handleEditMessage = (id: number) => {
    const messageToEdit = chatMessages.find(message => message.id === id)
    if (messageToEdit && messageToEdit.sender === "You") {
      setEditingMessageId(id)
      setEditMessageContent(messageToEdit.content)
    }
  }

  const handleSaveEdit = () => {
    if (editingMessageId !== null) {
      setChatMessages(chatMessages.map(message =>
        message.id === editingMessageId ? { ...message, content: editMessageContent } : message
      ))
      setEditingMessageId(null)
      setEditMessageContent("")
    }
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditMessageContent("")
  }

  const handleEmojiSelect = (emoji: Emoji) => {
    if (editingMessageId !== null) {
      setEditMessageContent(prev => prev + emoji.native);
    } else {
      setMessageInput(prev => prev + emoji.native);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to a server and get a URL back
      // For this example, we'll just add the file name to the chat
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "You",
        content: `File: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setChatMessages([...chatMessages, newMessage])
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMessages = chatMessages.filter(message =>
    message.content.toLowerCase().includes(chatSearchQuery.toLowerCase())
  )

  const toggleProfileSidebar = () => {
    setShowProfileSidebar(!showProfileSidebar)
  }

  const handleProfileUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const status = formData.get('status') as string
    setCurrentUser(prev => ({ ...prev, name, status }))
    setShowProfileModal(false)
  }

  const handleProfilePicUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCurrentUser(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out...")
    // For now, we'll just close the modal
    setShowProfileModal(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
    {/* Left sidebar (Contact list) */}
    <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r flex flex-col ${showChatArea ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 flex justify-between items-center bg-gray-50">
        <Avatar>
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex space-x-2">
          <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 relative">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer">
                      <Camera className="h-4 w-4" />
                    </Label>
                    <Input id="avatar-upload" type="file" className="hidden" onChange={handleProfilePicUpdate} accept="image/*" />
                  </Avatar>
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={currentUser.name} />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input id="status" name="status" defaultValue={currentUser.status} />
                </div>
                <div className="flex justify-between">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-8"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
              selectedContact.id === contact.id ? "bg-gray-100" : ""
            }`}
            onClick={() => {
              setSelectedContact(contact)
              setShowChatArea(true)
            }}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="font-semibold">{contact.name}</div>
              <div className="text-sm text-gray-500">{contact.lastMessage}</div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>

    {/* Main chat area */}
    <div className={`flex-1 flex flex-col ${showChatArea ? 'flex' : 'hidden md:flex'}`}>
      {/* Chat header */}
      <div className="p-4 flex justify-between items-center bg-gray-50 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setShowChatArea(false)}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
            <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 font-semibold">{selectedContact.name}</div>
        </div>
        <div className="flex space-x-2">
          <div className="relative hidden md:block">
            <Input
              className="pl-8 h-8"
              placeholder="Search in chat"
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            {chatSearchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setChatSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleProfileSidebar}
          >
            {showProfileSidebar ? <ChevronRight className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {filteredMessages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === "You" ? "text-right" : "text-left"}`}
          >
            {editingMessageId === message.id ? (
              <div className="flex items-center justify-end space-x-2">
                <Input
                  value={editMessageContent}
                  onChange={(e) => setEditMessageContent(e.target.value)}
                  className="flex-grow"
                />
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === "You" ? "bg-green-100" : "bg-white"
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
              </div>
            )}
            {message.sender === "You" && !editingMessageId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleEditMessage(message.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDeleteMessage(message.id)}>
                    <X className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 bg-gray-50 border-t flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Smile className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="h-6 w-6" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <Textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1"
          rows={1}
        />
        <Button variant="ghost" size="icon" onClick={handleSendMessage}>
          <Send className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon">
          <Mic className="h-6 w-6" />
        </Button>
      </div>
    </div>

    {/* Profile sidebar */}
    {(isLargeScreen && showProfileSidebar) && (
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-l">
        <div className="p-4 flex justify-between items-center bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Contact Info</h2>
          <Button variant="ghost" size="icon" onClick={toggleProfileSidebar}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-4 flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
            <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
          <p className="text-gray-500">{selectedContact.status}</p>
          <p className="text-gray-500">{selectedContact.phone}</p>
        </div>
      </div>
    )}
  </div>
  )
}

export default WhatsAppChatUI