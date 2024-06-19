import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from 'react-feather';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(data => {
        const top5Ids = data.slice(0, 5);
        return Promise.all(top5Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        ));
      })
      .then(stories => {
        setStories(stories);
        setFilteredStories(stories);
      })
      .catch(error => console.error('Error fetching stories:', error));
  }, []);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, stories]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
          <div className="flex items-center">
            <Sun className="mr-2" />
            <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
            <Moon className="ml-2" />
          </div>
        </div>
        <Input 
          placeholder="Search stories..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="mb-4"
        />
        <div className="space-y-4">
          {filteredStories.map(story => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>{story.score} upvotes</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Read more
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;