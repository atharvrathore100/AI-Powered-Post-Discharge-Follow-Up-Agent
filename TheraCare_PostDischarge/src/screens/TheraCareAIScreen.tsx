import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TC } from '../theme/colors';
import TheraCareHeader from '../components/TheraCareHeader';
import { initialAIMessages, getAIResponse, medications } from '../data/mockData';

type Message = { id: string; role: 'user' | 'ai'; text: string };

const QUICK_PROMPTS = [
  'What are my current medications?',
  'How should I take Acetaminophen?',
  'What are warning signs I should watch for?',
  'When is my next appointment?',
];

export default function TheraCareAIScreen() {
  const [messages, setMessages] = useState<Message[]>(
    initialAIMessages.map((m, i) => ({ id: String(i), role: m.role as 'user' | 'ai', text: m.text }))
  );
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    const aiText = getAIResponse(text.trim(), medications);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <TheraCareHeader title="TheraCare AI" />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {/* AI Avatar intro banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiAvatar}>
            <Ionicons name="hardware-chip" size={28} color={TC.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>TheraCare AI Assistant</Text>
            <Text style={styles.aiBannerSub}>Ask me about your medications, appointments, or recovery instructions.</Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <View key={msg.id} style={styles.userBubbleRow}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{msg.text}</Text>
              </View>
            </View>
          ) : (
            <View key={msg.id} style={styles.aiBubbleRow}>
              <View style={styles.aiAvatarSmall}>
                <Ionicons name="hardware-chip" size={14} color={TC.teal} />
              </View>
              <View style={styles.aiCard}>
                <Text style={styles.aiCardText}>{msg.text}</Text>
              </View>
            </View>
          )
        )}

        {/* Quick prompts */}
        <Text style={styles.quickLabel}>Quick questions</Text>
        <View style={styles.quickRow}>
          {QUICK_PROMPTS.map((q) => (
            <TouchableOpacity key={q} style={styles.quickChip} onPress={() => sendMessage(q)} activeOpacity={0.8}>
              <Text style={styles.quickChipText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask me about your medications…"
          placeholderTextColor={TC.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 10 },

  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: TC.tealLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: TC.tealAI,
  },
  aiAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TC.teal,
  },
  aiBannerTitle: { fontSize: 15, fontWeight: '700', color: TC.tealDark },
  aiBannerSub: { fontSize: 12, color: TC.textSecondary, marginTop: 2, lineHeight: 17 },

  userBubbleRow: { alignItems: 'flex-end' },
  userBubble: {
    backgroundColor: TC.teal,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userBubbleText: { color: '#fff', fontSize: 14, lineHeight: 20 },

  aiBubbleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  aiAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: TC.teal,
  },
  aiCard: {
    flex: 1,
    backgroundColor: TC.bgCard,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  aiCardText: { fontSize: 14, color: TC.textPrimary, lineHeight: 21 },

  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TC.textMuted,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickRow: { gap: 8 },
  quickChip: {
    backgroundColor: TC.bgCard,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: TC.border,
  },
  quickChipText: { fontSize: 13, color: TC.teal, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: TC.bgCard,
    borderTopWidth: 1,
    borderTopColor: TC.border,
  },
  input: {
    flex: 1,
    backgroundColor: TC.bg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: TC.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: TC.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TC.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: TC.tealMid, opacity: 0.5 },
});
