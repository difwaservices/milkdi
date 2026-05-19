import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/network/api_client.dart';
import '../../../data/services/auth_service.dart' as auth;

final faqsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final client = ref.read(apiClientProvider);
  final data = await client.get('/faq');
  return data['data'] as List<dynamic>;
});

class FaqPage extends ConsumerStatefulWidget {
  const FaqPage({super.key});

  @override
  ConsumerState<FaqPage> createState() => _FaqPageState();
}

class _FaqPageState extends ConsumerState<FaqPage> {
  Future<void> _deleteFaq(String id) async {
    try {
      final client = ref.read(apiClientProvider);
      await client.delete('/faq/$id', requiresAuth: true);
      ref.invalidate(faqsProvider);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('FAQ deleted')));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to delete')));
    }
  }

  void _showAddEditDialog({Map<String, dynamic>? faq}) {
    final questionController = TextEditingController(text: faq?['question'] ?? '');
    final answerController = TextEditingController(text: faq?['answer'] ?? '');
    final isEditing = faq != null;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isEditing ? 'Edit FAQ' : 'Add FAQ'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: questionController, decoration: const InputDecoration(labelText: 'Question')),
            TextField(controller: answerController, decoration: const InputDecoration(labelText: 'Answer'), maxLines: 3),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              final client = ref.read(apiClientProvider);
              final payload = {'question': questionController.text, 'answer': answerController.text};
              try {
                if (isEditing) {
                  await client.put('/faq/${faq['_id']}', data: payload, requiresAuth: true);
                } else {
                  await client.post('/faq', data: payload, requiresAuth: true);
                }
                ref.invalidate(faqsProvider);
                if (mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(isEditing ? 'Updated' : 'Created')));
                }
              } catch (e) {
                if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error saving FAQ')));
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final faqsAsync = ref.watch(faqsProvider);
    final userAsync = ref.watch(auth.userProfileProvider);
    final isAdmin = userAsync.when(data: (u) => u.role == 'admin', loading: () => false, error: (_, __) => false);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Common Questions', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: Colors.black,
        actions: [
          if (isAdmin)
             IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: () => _showAddEditDialog()),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(faqsProvider.future),
        child: faqsAsync.when(
          data: (faqs) {
            if (faqs.isEmpty) {
               return const Center(child: Text('No FAQs found'));
            }
            return ListView.separated(
              padding: const EdgeInsets.all(24),
              itemCount: faqs.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final faq = faqs[index];
                return Stack(
                  children: [
                    _FaqTile(question: faq['question'], answer: faq['answer']),
                    if (isAdmin)
                      Positioned(
                        right: 8,
                        top: 8,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, size: 18, color: Colors.blue),
                              onPressed: () => _showAddEditDialog(faq: faq),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                              onPressed: () => _deleteFaq(faq['_id']),
                            ),
                          ],
                        ),
                      ),
                  ],
                );
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.help_outline_rounded, size: 56, color: Colors.grey),
                SizedBox(height: 12),
                Text('Could not load questions',
                    style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                SizedBox(height: 6),
                Text('Pull down to refresh', style: TextStyle(color: Colors.grey, fontSize: 13)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FaqTile extends StatefulWidget {
  final String question;
  final String answer;

  const _FaqTile({required this.question, required this.answer});

  @override
  State<_FaqTile> createState() => _FaqTileState();
}

class _FaqTileState extends State<_FaqTile> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: _isExpanded ? AppColors.primary.withValues(alpha: 0.02) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _isExpanded ? AppColors.primary.withValues(alpha: 0.2) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          ListTile(
            onTap: () => setState(() => _isExpanded = !_isExpanded),
            title: Padding(
              padding: const EdgeInsets.only(right: 40.0), // Space for edit/delete buttons
              child: Text(
                widget.question,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  color: _isExpanded ? AppColors.primaryDark : const Color(0xFF1E293B),
                ),
              ),
            ),
            trailing: Icon(
              _isExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
              color: _isExpanded ? AppColors.primary : Colors.grey,
            ),
          ),
          if (_isExpanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
              child: SizedBox(
                width: double.infinity,
                child: Text(
                  widget.answer,
                  textAlign: TextAlign.left,
                  style: const TextStyle(
                    color: Colors.black54,
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

